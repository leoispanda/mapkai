// Deliberately frozen publication allowlist: only these reviewed recordings
// may be discovered or streamed. R2 keys, checksums and filenames are internal;
// browser clients receive stable same-origin playback URLs.
const freeze = value => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};

export const VIDEO_REVISION = 'watch-only-20261024';

export const MUSIC_VIDEOS = freeze([
  {
    "id": "your-turn-asml",
    "title": {
      "zh": "Your Turn",
      "en": "Your Turn"
    },
    "description": {
      "zh": "从画布到星空，从显微镜到光刻机。13 位人物与 ASML 的故事，随音乐流转。",
      "en": "From canvas to cosmos, microscopes to lithography. The stories of 13 people and ASML, carried by music."
    },
    "durationSeconds": 116.075,
    "version": "v3-asml",
    "poster": "/music/videos/posters/your-turn-asml.jpg",
    "featured": true,
    "qualities": [
      {
        "id": "phone",
        "label": {
          "zh": "720p · 手机版",
          "en": "720p · Mobile"
        },
        "bytes": 38637548,
        "width": 1280,
        "height": 720,
        "objectKey": "music-videos/your-turn/your-turn-asml/ab05205f0a5f52ec8b8ddbf56f31eb06fc51e551e9fa9c5def3e6345873fa6e7.mp4",
        "sha256": "ab05205f0a5f52ec8b8ddbf56f31eb06fc51e551e9fa9c5def3e6345873fa6e7",
        "etag": "42d72bcf44758d593f8b49f39830e12f",
        "filename": "mapkai-your-turn-asml-phone.mp4"
      },
      {
        "id": "hd",
        "label": {
          "zh": "1080p · 高清",
          "en": "1080p · HD"
        },
        "bytes": 77477987,
        "width": 1920,
        "height": 1080,
        "objectKey": "music-videos/your-turn/your-turn-asml/7b74dae349d1cb0480add0267a0820f81c2667c0b4d8b3f107106d096d2cf9e3.mp4",
        "sha256": "7b74dae349d1cb0480add0267a0820f81c2667c0b4d8b3f107106d096d2cf9e3",
        "etag": "a7bd64d35e28582269c38dee64425754",
        "filename": "mapkai-your-turn-asml-hd.mp4"
      }
    ]
  },
  {
    "id": "your-turn-artworks",
    "title": {
      "zh": "Your Turn (Draft 2)",
      "en": "Your Turn (Draft 2)"
    },
    "description": {
      "zh": "18 位荷兰人物的肖像、代表作与研究领域交替展开。使用较早版本歌曲。",
      "en": "Portraits, signature works and fields of discovery of 18 Dutch figures. Set to an earlier version of the song."
    },
    "durationSeconds": 120.043,
    "version": "v2",
    "poster": "/music/videos/posters/your-turn-artworks.jpg",
    "featured": false,
    "qualities": [
      {
        "id": "phone",
        "label": {
          "zh": "720p · 手机版",
          "en": "720p · Mobile"
        },
        "bytes": 47218032,
        "width": 1280,
        "height": 720,
        "objectKey": "music-videos/your-turn/your-turn-artworks/a782ebea3881ab46643ebc1a41fa9bbe4a730685ec7c50a4d7f0c485750b7766.mp4",
        "sha256": "a782ebea3881ab46643ebc1a41fa9bbe4a730685ec7c50a4d7f0c485750b7766",
        "etag": "e49956b288657246be5acb7b4f6d8217",
        "filename": "mapkai-your-turn-artworks-phone.mp4"
      }
    ]
  },
  {
    "id": "your-turn-original",
    "title": {
      "zh": "Your Turn (Draft 1)",
      "en": "Your Turn (Draft 1)"
    },
    "description": {
      "zh": "从绘画、科学到历史与体育，以五幅群像开启 Your Turn 的第一版影像。使用原版歌曲。",
      "en": "Five illustrated worlds of art, science, history and sport: the first visual chapter of Your Turn, with the original song."
    },
    "durationSeconds": 120.043,
    "version": "v1",
    "poster": "/music/videos/posters/your-turn-original.jpg",
    "featured": false,
    "qualities": [
      {
        "id": "phone",
        "label": {
          "zh": "720p · 手机版",
          "en": "720p · Mobile"
        },
        "bytes": 27240907,
        "width": 1280,
        "height": 720,
        "objectKey": "music-videos/your-turn/your-turn-original/31c8153af9387307163141888818c8d4dfb7011343036d78b61deb2e1a18b593.mp4",
        "sha256": "31c8153af9387307163141888818c8d4dfb7011343036d78b61deb2e1a18b593",
        "etag": "0167cf8714c7a0057c2a866765f69089",
        "filename": "mapkai-your-turn-original-phone.mp4"
      }
    ]
  }
]);

export function findVideoQuality(id, quality = 'phone') {
  const video = MUSIC_VIDEOS.find(item => item.id === id);
  const rendition = video?.qualities.find(item => item.id === quality);
  return rendition ? { video, rendition } : null;
}

export function publicVideos() {
  return MUSIC_VIDEOS.map(({ id, title, description, durationSeconds, poster, featured, version, qualities }) => ({
    id, title, description, durationSeconds, poster, featured, version,
    qualities: qualities.map(({ id: quality, label, bytes, width, height }) => {
      const url = `/api/music/video?id=${encodeURIComponent(id)}&quality=${encodeURIComponent(quality)}&revision=${VIDEO_REVISION}`;
      return { id: quality, label, bytes, width, height, url };
    }),
  }));
}
