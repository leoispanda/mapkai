// Deliberately frozen publication allowlist: only these reviewed recordings
// may be discovered or streamed. R2 keys, checksums and filenames are internal;
// browser clients receive stable same-origin playback and download URLs.
const freeze = value => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};

export const MUSIC_VIDEOS = freeze([
  {
    "id": "your-turn-asml",
    "title": {
      "zh": "Your Turn · 荷兰名人与 ASML",
      "en": "Your Turn · Dutch Voices & ASML"
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
        "bytes": 34496951,
        "width": 1280,
        "height": 720,
        "objectKey": "music-videos/your-turn/your-turn-asml/67cfb406f37eeae7b27881f652aaf35d19f9f0559899ee2d5e4618dc2a090c8a.mp4",
        "sha256": "67cfb406f37eeae7b27881f652aaf35d19f9f0559899ee2d5e4618dc2a090c8a",
        "etag": "334bedc9f24bf0e7bb691c1b3d191ce3",
        "filename": "mapkai-your-turn-asml-phone.mp4"
      },
      {
        "id": "hd",
        "label": {
          "zh": "1080p · 高清",
          "en": "1080p · HD"
        },
        "bytes": 81396602,
        "width": 1920,
        "height": 1080,
        "objectKey": "music-videos/your-turn/your-turn-asml/8b55857d6635dda528784cbe777d6ac0a6240c0938503003cd25e0239c992475.mp4",
        "sha256": "8b55857d6635dda528784cbe777d6ac0a6240c0938503003cd25e0239c992475",
        "etag": "9219b7fc0e78a5a7532a714644daa05a",
        "filename": "mapkai-your-turn-asml-hd.mp4"
      }
    ]
  },
  {
    "id": "your-turn-artworks",
    "title": {
      "zh": "Your Turn · 人物与代表作版",
      "en": "Your Turn · People & Their Work"
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
        "bytes": 36986575,
        "width": 1280,
        "height": 720,
        "objectKey": "music-videos/your-turn/your-turn-artworks/8861dadc105a33132ec4427c3cb5f728daf83e2a6e868ea1e6045b7ea460f0f2.mp4",
        "sha256": "8861dadc105a33132ec4427c3cb5f728daf83e2a6e868ea1e6045b7ea460f0f2",
        "etag": "83b9c2edf9e906e6c412c16cd7a4ccb8",
        "filename": "mapkai-your-turn-artworks-phone.mp4"
      }
    ]
  },
  {
    "id": "your-turn-original",
    "title": {
      "zh": "Your Turn · 原始插画版",
      "en": "Your Turn · Original Illustrated Cut"
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
        "bytes": 20346063,
        "width": 1280,
        "height": 720,
        "objectKey": "music-videos/your-turn/your-turn-original/2c9a1721bb4e778362d4cdc0789721935656046d546cc3c2e983e3fd529638ea.mp4",
        "sha256": "2c9a1721bb4e778362d4cdc0789721935656046d546cc3c2e983e3fd529638ea",
        "etag": "191541ae432c5d69fe2cc88fa4de1261",
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
      const url = `/api/music/video?id=${encodeURIComponent(id)}&quality=${encodeURIComponent(quality)}`;
      return { id: quality, label, bytes, width, height, url, downloadUrl: `${url}&download=1` };
    }),
  }));
}
