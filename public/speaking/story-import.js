import { MAX_FILE_BYTES } from './story-context.js';

export async function readStoryFile(file) {
  if (file.size > MAX_FILE_BYTES) throw new Error(`「${file.name}」超过 5 MB，请换一份较小的文件。`);
  const extension = file.name.split('.').pop().toLowerCase();
  if (['txt', 'md'].includes(extension)) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const encoding = bytes[0] === 255 && bytes[1] === 254 ? 'utf-16le' : bytes[0] === 254 && bytes[1] === 255 ? 'utf-16be' : 'utf-8';
    try { return new TextDecoder(encoding, { fatal: true }).decode(bytes); }
    catch { throw new Error(`「${file.name}」的文字编码无法读取，请另存为 UTF-8 文本。`); }
  }
  if (extension === 'docx') {
    const { default: JSZip } = await import('./vendor/jszip.js');
    let zip;
    try { zip = await JSZip.loadAsync(await file.arrayBuffer()); }
    catch { throw new Error(`「${file.name}」无法读取，请确认它是未加密的 .docx 文档。`); }
    const document = zip.file('word/document.xml');
    if (!document) throw new Error(`「${file.name}」不是有效的 Word 文档。`);
    const xml = await new Promise((resolve, reject) => {
      let length = 0, result = '';
      const stream = document.internalStream('string');
      stream.on('data', chunk => {
        length += chunk.length;
        if (length > 2 * 1024 * 1024) { stream.pause(); reject(new Error('Word 文档展开后太长，请拆分后导入。')); return; }
        result += chunk;
      }).on('error', reject).on('end', () => resolve(result)).resume();
    });
    const dom = new DOMParser().parseFromString(xml, 'application/xml');
    if (dom.querySelector('parsererror')) throw new Error('Word 文档内容损坏，请重新导出。');
    const ns = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
    return Array.from(dom.getElementsByTagNameNS(ns, 'p'), paragraph =>
      Array.from(paragraph.getElementsByTagNameNS(ns, '*')).map(node =>
        node.localName === 't' ? node.textContent : node.localName === 'tab' ? '\t' : ['br', 'cr'].includes(node.localName) ? '\n' : '').join('')
    ).join('\n');
  }
  if (extension === 'pdf') {
    const pdfjs = await import('./vendor/pdf.js');
    pdfjs.GlobalWorkerOptions.workerSrc = '/speaking/vendor/pdf.worker.js';
    const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false, useSystemFonts: false, cMapUrl: '/speaking/vendor/cmaps/', cMapPacked: true });
    try {
      const pdf = await task.promise;
      if (pdf.numPages > 50) throw new Error('PDF 超过 50 页，请先导出你想聊的部分。');
      const pages = [];
      let length = 0;
      for (let number = 1; number <= pdf.numPages; number++) {
        const page = await pdf.getPage(number);
        const content = await page.getTextContent();
        const text = content.items.map(item => typeof item.str === 'string' ? item.str + (item.hasEOL ? '\n' : ' ') : '').join('');
        length += text.length;
        if (length > 30000) throw new Error('PDF 文字超过 30,000 字，请导出较短的部分。');
        pages.push(text); page.cleanup();
      }
      return pages.join('\n\n');
    } catch (error) {
      if (error.name === 'PasswordException') throw new Error('这份 PDF 有密码，请先导出未加密的副本。');
      if (error.name === 'InvalidPDFException') throw new Error('PDF 无法读取，请重新导出文件。');
      throw error;
    } finally { await task.destroy(); }
  }
  throw new Error(`暂不支持「${file.name}」。请使用 TXT、Markdown、Word（.docx）或文字型 PDF。`);
}
