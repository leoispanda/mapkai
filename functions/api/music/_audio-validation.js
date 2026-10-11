import { AUDIO_TYPES, MAX_AUDIO_BYTES, inputError } from './_shared.js';

const DECLARED_TYPES = {
  mp3: new Set(['audio/mpeg', 'audio/mp3', 'audio/x-mp3']),
  m4a: new Set(['audio/mp4', 'audio/m4a', 'audio/x-m4a']),
  wav: new Set(['audio/wav', 'audio/wave', 'audio/x-wav', 'audio/vnd.wave']),
};
const ascii = (bytes, offset, count) => String.fromCharCode(...bytes.subarray(offset, offset + count));
const sliceBytes = async (file, start, count) => new Uint8Array(await file.slice(start, start + count).arrayBuffer());

function mpegFrame(bytes, offset = 0) {
  if (offset + 4 > bytes.length || bytes[offset] !== 0xff || (bytes[offset + 1] & 0xe0) !== 0xe0) return null;
  const version = (bytes[offset + 1] >> 3) & 3;
  const layerBits = (bytes[offset + 1] >> 1) & 3;
  const bitrateIndex = bytes[offset + 2] >> 4;
  const sampleIndex = (bytes[offset + 2] >> 2) & 3;
  if (version === 1 || !layerBits || !bitrateIndex || bitrateIndex === 15 || sampleIndex === 3 || (bytes[offset + 3] & 3) === 2) return null;
  const layer = 4 - layerBits;
  const bitrates = version === 3 ? {
    1: [32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448],
    2: [32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384],
    3: [32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
  } : {
    1: [32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256],
    2: [8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
    3: [8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
  };
  const bitrate = bitrates[layer][bitrateIndex - 1] * 1000;
  const sampleRate = [44100, 48000, 32000][sampleIndex] / (version === 3 ? 1 : version === 2 ? 2 : 4);
  const padding = (bytes[offset + 2] >> 1) & 1;
  const size = layer === 1 ? (Math.floor(12 * bitrate / sampleRate) + padding) * 4
    : Math.floor((layer === 3 && version !== 3 ? 72 : 144) * bitrate / sampleRate) + padding;
  return { size, version, layer, sampleRate };
}

async function hasMpegFrames(file, bytes, start) {
  for (let index = 0; index <= bytes.length - 4; index++) {
    const first = mpegFrame(bytes, index);
    if (!first || start + index + first.size + 4 > file.size) continue;
    const nextOffset = start + index + first.size;
    const second = mpegFrame(await sliceBytes(file, nextOffset, 4));
    if (second && second.version === first.version && second.layer === first.layer
      && second.sampleRate === first.sampleRate && nextOffset + second.size <= file.size) return true;
  }
  return false;
}

async function validMp3(file, first) {
  let start = 0;
  if (ascii(first, 0, 3) === 'ID3') {
    if (first.length < 10 || ![2, 3, 4].includes(first[3]) || first.slice(6, 10).some(value => value > 127)) return false;
    start = 10 + ((first[6] << 21) | (first[7] << 14) | (first[8] << 7) | first[9]);
    if (first[3] === 4 && (first[5] & 0x10)) start += 10;
    if (start >= file.size - 3) return false;
  }
  return hasMpegFrames(file, start ? await sliceBytes(file, start, 4096) : first, start);
}

async function validWav(file, first) {
  if (ascii(first, 0, 4) !== 'RIFF' || ascii(first, 8, 4) !== 'WAVE') return false;
  const riffSize = new DataView(first.buffer, first.byteOffset, first.byteLength).getUint32(4, true);
  if (riffSize + 8 > file.size || riffSize < 36) return false;
  let offset = 12;
  let format = false;
  let data = false;
  for (let count = 0; offset + 8 <= riffSize + 8 && count < 256; count++) {
    const chunk = await sliceBytes(file, offset, 32);
    if (chunk.length < 8) return false;
    const view = new DataView(chunk.buffer, chunk.byteOffset, chunk.byteLength);
    const size = view.getUint32(4, true);
    if (offset + 8 + size > riffSize + 8) return false;
    const type = ascii(chunk, 0, 4);
    if (type === 'fmt ') {
      if (size < 16 || chunk.length < 24 || ![1, 3, 6, 7, 0xfffe].includes(view.getUint16(8, true))
        || view.getUint16(10, true) < 1 || view.getUint16(10, true) > 32 || view.getUint32(12, true) < 1) return false;
      format = true;
    }
    if (type === 'data' && size > 0) data = true;
    if (format && data) return true;
    offset += 8 + size + (size % 2);
  }
  return false;
}

function boxHeader(bytes, offset, totalSize) {
  if (offset + 8 > bytes.length) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let size = view.getUint32(offset);
  let header = 8;
  if (size === 1) {
    if (offset + 16 > bytes.length) return null;
    size = Number(view.getBigUint64(offset + 8));
    header = 16;
  } else if (size === 0) size = totalSize - offset;
  if (!Number.isSafeInteger(size) || size < header || offset + size > totalSize) return null;
  return { size, header, type: ascii(bytes, offset + 4, 4) };
}

function childBoxes(bytes, parent) {
  const end = parent.start + parent.size;
  const children = [];
  for (let offset = parent.start + parent.header; offset < end;) {
    if (children.length >= 1024) return null;
    const box = boxHeader(bytes, offset, end);
    if (!box) return null;
    children.push({ ...box, start: offset });
    offset += box.size;
  }
  return children;
}

function mediaSamples(bytes) {
  const root = { start: -8, header: 8, size: bytes.length + 8 };
  const moov = childBoxes(bytes, root)?.find(box => box.type === 'moov');
  const tracks = moov && childBoxes(bytes, moov)?.filter(box => box.type === 'trak');
  if (!tracks?.length) return null;
  const samples = [];
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const children = (parent, type) => parent && childBoxes(bytes, parent)?.find(box => box.type === type);
  for (const track of tracks) {
    const mdia = children(track, 'mdia');
    const handler = children(mdia, 'hdlr');
    if (!handler || handler.size < handler.header + 12) return null;
    const handlerType = ascii(bytes, handler.start + handler.header + 8, 4);
    if (handlerType === 'vide') return null;
    if (handlerType !== 'soun') continue;
    const table = children(children(mdia, 'minf'), 'stbl');
    const stsd = children(table, 'stsd');
    const stsz = children(table, 'stsz');
    const stts = children(table, 'stts');
    const stsc = children(table, 'stsc');
    const offsets = children(table, 'stco') || children(table, 'co64');
    if (!stsd || stsd.size < stsd.header + 44 || !stsz || stsz.size < stsz.header + 12
      || !stts || stts.size < stts.header + 16 || !stsc || stsc.size < stsc.header + 20
      || !offsets || offsets.size < offsets.header + 12) return null;
    const descriptionCount = view.getUint32(stsd.start + stsd.header + 4);
    if (descriptionCount !== 1) return null;
    const codecOffset = stsd.start + stsd.header + 8;
    const codec = boxHeader(bytes, codecOffset, stsd.start + stsd.size);
    if (!codec || codec.header !== 8 || codec.size < 36 || !['mp4a', 'alac', 'ac-3', 'ec-3', 'Opus', 'fLaC'].includes(codec.type)
      || !view.getUint16(codecOffset + 24) || !view.getUint32(codecOffset + 32)) return null;
    const fixedSize = view.getUint32(stsz.start + stsz.header + 4);
    const count = view.getUint32(stsz.start + stsz.header + 8);
    if (!count || count > MAX_AUDIO_BYTES || (!fixedSize && stsz.size !== stsz.header + 12 + count * 4)) return null;
    const sampleSizes = fixedSize ? null : Array.from({ length: count }, (_, index) => view.getUint32(stsz.start + stsz.header + 12 + index * 4));
    if (sampleSizes?.some(size => !size)) return null;
    const sampleBytes = fixedSize ? fixedSize * count : sampleSizes.reduce((sum, size) => sum + size, 0);
    if (!Number.isSafeInteger(sampleBytes) || sampleBytes > MAX_AUDIO_BYTES) return null;
    const durationCount = view.getUint32(stts.start + stts.header + 4);
    if (!durationCount || stts.size !== stts.header + 8 + durationCount * 8) return null;
    let timedSamples = 0;
    for (let index = 0; index < durationCount; index++) {
      const offset = stts.start + stts.header + 8 + index * 8;
      if (!view.getUint32(offset + 4)) return null;
      timedSamples += view.getUint32(offset);
    }
    if (timedSamples !== count) return null;
    const chunkCount = view.getUint32(offsets.start + offsets.header + 4);
    const offsetSize = offsets.type === 'co64' ? 8 : 4;
    if (!chunkCount || offsets.size !== offsets.header + 8 + chunkCount * offsetSize) return null;
    const chunkOffsets = Array.from({ length: chunkCount }, (_, index) => {
      const offset = offsets.start + offsets.header + 8 + index * offsetSize;
      return offsetSize === 8 ? Number(view.getBigUint64(offset)) : view.getUint32(offset);
    });
    const groupingCount = view.getUint32(stsc.start + stsc.header + 4);
    if (!groupingCount || stsc.size !== stsc.header + 8 + groupingCount * 12) return null;
    const grouping = [];
    for (let index = 0; index < groupingCount; index++) {
      const offset = stsc.start + stsc.header + 8 + index * 12;
      const first = view.getUint32(offset);
      const perChunk = view.getUint32(offset + 4);
      if (!first || first > chunkCount || !perChunk || view.getUint32(offset + 8) !== 1
        || (index === 0 ? first !== 1 : first <= grouping[index - 1].first)) return null;
      grouping.push({ first, perChunk });
    }
    let sampleIndex = 0;
    let groupIndex = 0;
    const chunks = [];
    for (let index = 0; index < chunkCount; index++) {
      if (grouping[groupIndex + 1]?.first === index + 1) groupIndex++;
      const end = sampleIndex + grouping[groupIndex].perChunk;
      if (end > count) return null;
      const size = fixedSize ? fixedSize * (end - sampleIndex) : sampleSizes.slice(sampleIndex, end).reduce((sum, value) => sum + value, 0);
      chunks.push({ offset: chunkOffsets[index], size });
      sampleIndex = end;
    }
    if (sampleIndex !== count) return null;
    samples.push({ sampleBytes, chunks });
  }
  return samples.length ? samples : null;
}

async function validM4a(file, first) {
  const ftyp = boxHeader(first, 0, file.size);
  if (!ftyp || ftyp.type !== 'ftyp' || ftyp.size < 16 || ftyp.size > 4096) return false;
  const brands = await sliceBytes(file, 0, ftyp.size);
  const brandNames = [ascii(brands, ftyp.header, 4)];
  for (let offset = ftyp.header + 8; offset + 4 <= brands.length; offset += 4) brandNames.push(ascii(brands, offset, 4));
  if (!brandNames.some(brand => ['M4A ', 'M4B ', 'isom', 'iso2', 'iso6', 'mp41', 'mp42'].includes(brand))) return false;
  let samples;
  const dataRanges = [];
  for (let offset = ftyp.size, count = 0; offset + 8 <= file.size && count < 128; count++) {
    const bytes = await sliceBytes(file, offset, 16);
    const box = boxHeader(bytes, 0, file.size - offset);
    if (!box) return false;
    if (box.type === 'moov') {
      if (box.size > 1024 * 1024) return false;
      samples = mediaSamples(await sliceBytes(file, offset, box.size));
      if (!samples) return false;
    }
    if (box.type === 'mdat' && box.size > box.header) dataRanges.push({ start: offset + box.header, end: offset + box.size });
    offset += box.size;
  }
  return Boolean(samples?.length && dataRanges.length && samples.every(sample => sample.chunks.every(chunk =>
    Number.isSafeInteger(chunk.offset) && dataRanges.some(range => chunk.offset >= range.start && chunk.offset + chunk.size <= range.end))));
}

export async function validateAudio(file) {
  if (!(file instanceof Blob) || typeof file.name !== 'string' || file.size < 1) throw inputError('Choose an audio file.');
  if (file.size > MAX_AUDIO_BYTES) throw inputError('Choose an audio file up to 25 MB.', 413);
  const extension = file.name.split('.').pop().toLowerCase();
  if (!Object.hasOwn(AUDIO_TYPES, extension)) throw inputError('Choose an MP3, M4A or WAV audio file.', 415);
  const declaredType = String(file.type || '').split(';')[0].trim().toLowerCase();
  if (declaredType && declaredType !== 'application/octet-stream' && !DECLARED_TYPES[extension].has(declaredType)) {
    throw inputError('The audio file type does not match its extension.', 415);
  }
  const first = await sliceBytes(file, 0, 4096);
  const valid = extension === 'mp3' ? await validMp3(file, first)
    : extension === 'wav' ? await validWav(file, first) : await validM4a(file, first);
  if (!valid) throw inputError('This file could not be recognized as valid audio.', 415);
  return { extension, contentType: AUDIO_TYPES[extension] };
}
