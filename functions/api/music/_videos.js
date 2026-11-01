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

export const VIDEO_REVISION = 'read-before-you-choose-20261101';

export const MUSIC_VIDEOS = freeze([
  {
    "id": "read-before-you-choose",
    "title": {
      "zh": "Read Before You Choose",
      "en": "Read Before You Choose"
    },
    "description": {
      "zh": "并排比较两袋麦片的单位价格，先看清每一份值多少，再决定买哪一袋。",
      "en": "Compare the unit prices on two cereal bags to see what each one offers before you choose."
    },
    "durationSeconds": 120.033,
    "version": "v1-mapkai",
    "poster": "/music/videos/posters/read-before-you-choose.jpg",
    "featured": true,
    "qualities": [
      {
        "id": "hd",
        "label": {
          "zh": "1080p · 高清兼容版",
          "en": "1080p · Compatible HD"
        },
        "bytes": 101313752,
        "width": 1920,
        "height": 1080,
        "objectKey": "music-videos/read-before-you-choose/9d6bfeb66449a402354c3aed624dda2d7392a324397a53d4802489f334125e5c.mp4",
        "sha256": "9d6bfeb66449a402354c3aed624dda2d7392a324397a53d4802489f334125e5c",
        "etag": "22f66aed528f7aebc001c97498c1706c",
        "filename": "mapkai-read-before-you-choose-hd.mp4"
      },
      {
        "id": "phone",
        "label": {
          "zh": "720p · 流畅版",
          "en": "720p · Smooth"
        },
        "bytes": 59670570,
        "width": 1280,
        "height": 720,
        "objectKey": "music-videos/read-before-you-choose/14db2ab65ee5ca52590031bfa54b62087d43238cd2c11f4844eb0ef7054743ae.mp4",
        "sha256": "14db2ab65ee5ca52590031bfa54b62087d43238cd2c11f4844eb0ef7054743ae",
        "etag": "a8a4bb5e6ca1635d87d2755ab4d673ff",
        "filename": "mapkai-read-before-you-choose-phone.mp4"
      }
    ]
  },
  {
    "id": "warm-a-little-longer",
    "title": {
      "zh": "Warm a Little Longer",
      "en": "Warm a Little Longer"
    },
    "description": {
      "zh": "清晨茶杯的羊毛杯套与双杯对照实验：隔热不是凭空产生热量，而是让热散失得更慢一些。",
      "en": "A wool sleeve on a morning mug and a two-cup experiment: thermal insulation does not create heat, it slows the heat escaping."
    },
    "durationSeconds": 120.033,
    "version": "v1-mapkai",
    "poster": "/music/videos/posters/warm-a-little-longer.jpg",
    "featured": true,
    "qualities": [
      {
        "id": "hd",
        "label": {
          "zh": "1080p · 高清兼容版",
          "en": "1080p · Compatible HD"
        },
        "bytes": 44349564,
        "width": 1920,
        "height": 1080,
        "objectKey": "music-videos/warm-a-little-longer/fe7fcd160659f3212b3b7e75434eea5ddb7db0aeb63652629e337ce946a4809b.mp4",
        "sha256": "fe7fcd160659f3212b3b7e75434eea5ddb7db0aeb63652629e337ce946a4809b",
        "etag": "31f0e7451193515243b3f446d32be1d1",
        "filename": "mapkai-warm-a-little-longer-hd.mp4"
      },
      {
        "id": "phone",
        "label": {
          "zh": "720p · 流畅版",
          "en": "720p · Smooth"
        },
        "bytes": 17854690,
        "width": 1280,
        "height": 720,
        "objectKey": "music-videos/warm-a-little-longer/93d253412a54bdf8a3843aca89637ba33fa960a59a02387cefdc3556b2dbbf59.mp4",
        "sha256": "93d253412a54bdf8a3843aca89637ba33fa960a59a02387cefdc3556b2dbbf59",
        "etag": "9f38632adda656330a21aaa28054fb61",
        "filename": "mapkai-warm-a-little-longer-phone.mp4"
      }
    ]
  },
  {
    "id": "read-the-small-print",
    "title": {
      "zh": "Read the Small Print",
      "en": "Read the Small Print"
    },
    "description": {
      "zh": "一张折起的时刻表、一站改变的路线：先读懂变化，再决定下一步。",
      "en": "A folded timetable and a changed stop: read what changed before choosing the next step."
    },
    "durationSeconds": 120.033,
    "version": "v1-mapkai",
    "poster": "/music/videos/posters/read-the-small-print.jpg",
    "featured": true,
    "qualities": [
      {
        "id": "hd",
        "label": {
          "zh": "1080p · 高清兼容版",
          "en": "1080p · Compatible HD"
        },
        "bytes": 64735683,
        "width": 1920,
        "height": 1080,
        "objectKey": "music-videos/read-the-small-print/6fc4855b79a17bb02ad494d78fb94050d99964a24b8b3b4d0421a65332f38502.mp4",
        "sha256": "6fc4855b79a17bb02ad494d78fb94050d99964a24b8b3b4d0421a65332f38502",
        "etag": "5290e5e722f01e857724da39efa8138a",
        "filename": "mapkai-read-the-small-print-hd.mp4"
      },
      {
        "id": "phone",
        "label": {
          "zh": "720p · 流畅版",
          "en": "720p · Smooth"
        },
        "bytes": 38407778,
        "width": 1280,
        "height": 720,
        "objectKey": "music-videos/read-the-small-print/33e2346aee974d357a7023ab96a631989b35a851d869396b3f1b7382253bb2f4.mp4",
        "sha256": "33e2346aee974d357a7023ab96a631989b35a851d869396b3f1b7382253bb2f4",
        "etag": "314aebba7b4d75becd1f03153614fd39",
        "filename": "mapkai-read-the-small-print-phone.mp4"
      }
    ]
  },
  {
    "id": "same-length",
    "title": {
      "zh": "Same Length",
      "en": "Same Length"
    },
    "description": {
      "zh": "两条纸带、一把尺子与共同的零刻度：把单位和数字写在一起，再比较长度。",
      "en": "Two paper strips, one ruler and a shared zero mark: keep the unit with the number to compare their lengths."
    },
    "durationSeconds": 120.033,
    "version": "v1-mapkai",
    "poster": "/music/videos/posters/same-length.jpg",
    "featured": true,
    "qualities": [
      {
        "id": "hd",
        "label": {
          "zh": "1080p · 高清兼容版",
          "en": "1080p · Compatible HD"
        },
        "bytes": 85538135,
        "width": 1920,
        "height": 1080,
        "objectKey": "music-videos/same-length/a9622701148f7b2e78655779c3afedd5bb3c52871e4353666e5c5811abe8e670.mp4",
        "sha256": "a9622701148f7b2e78655779c3afedd5bb3c52871e4353666e5c5811abe8e670",
        "etag": "e82c41409364b29175929a0f62f3343e",
        "filename": "mapkai-same-length-hd.mp4"
      },
      {
        "id": "phone",
        "label": {
          "zh": "720p · 流畅版",
          "en": "720p · Smooth"
        },
        "bytes": 76778557,
        "width": 1280,
        "height": 720,
        "objectKey": "music-videos/same-length/d9ad1763bd5fd11ad8fe19d1d5fdda6919de4dd4aa413ed4bb1fa54dbbaf1757.mp4",
        "sha256": "d9ad1763bd5fd11ad8fe19d1d5fdda6919de4dd4aa413ed4bb1fa54dbbaf1757",
        "etag": "9a3b818df049002a20c34192a046857c",
        "filename": "mapkai-same-length-phone.mp4"
      }
    ]
  },
  {
    "id": "when-the-money-arrives",
    "title": {
      "zh": "When the Money Arrives",
      "en": "When the Money Arrives"
    },
    "description": {
      "zh": "钱什么时候到账，决定小店今天能支付什么、下周还能留下多少现金。",
      "en": "When money arrives, the order of receipts and payments changes what a shop can pay today and carry into next week."
    },
    "durationSeconds": 120.043,
    "version": "v1-mapkai",
    "poster": "/music/videos/posters/when-the-money-arrives.jpg",
    "featured": true,
    "qualities": [
      {
        "id": "hd",
        "label": {
          "zh": "1080p · 高清兼容版",
          "en": "1080p · Compatible HD"
        },
        "bytes": 189857776,
        "width": 1920,
        "height": 1080,
        "objectKey": "music-videos/when-the-money-arrives/934545be418c45fb1938fe6d5bad7e1eec44293a851fcab96f648c70192e7c58.mp4",
        "sha256": "934545be418c45fb1938fe6d5bad7e1eec44293a851fcab96f648c70192e7c58",
        "etag": "81216b6edce9fc5a59932c439e8c5798",
        "filename": "mapkai-when-the-money-arrives-hd.mp4"
      },
      {
        "id": "phone",
        "label": {
          "zh": "720p · 流畅版",
          "en": "720p · Smooth"
        },
        "bytes": 127137467,
        "width": 1280,
        "height": 720,
        "objectKey": "music-videos/when-the-money-arrives/6135c8e78a946a70c0d81569ed1fb33be56dc56c980b0f2f0fd426c42a25e6fb.mp4",
        "sha256": "6135c8e78a946a70c0d81569ed1fb33be56dc56c980b0f2f0fd426c42a25e6fb",
        "etag": "98f4a531cd0eb19a7b9767b3d8386dce",
        "filename": "mapkai-when-the-money-arrives-phone.mp4"
      }
    ]
  },
  {
    "id": "under-the-blue",
    "title": {
      "zh": "Under the Blue",
      "en": "Under the Blue"
    },
    "description": {
      "zh": "同一幅蓝色河景，不同的理解。从笔触、留白与颜料层次，重新观察我们看到的意义。",
      "en": "One blue river painting, different readings. Look again at brushstrokes, open space and paint layers, and the meanings we find."
    },
    "durationSeconds": 140.042417,
    "version": "v1-mapkai",
    "poster": "/music/videos/posters/under-the-blue.jpg",
    "featured": true,
    "qualities": [
      {
        "id": "phone",
        "label": {
          "zh": "720p · 流畅版",
          "en": "720p · Smooth"
        },
        "bytes": 88389486,
        "width": 1280,
        "height": 720,
        "objectKey": "music-videos/under-the-blue/0c9e6e3a7ec125637a995232f69af289ba07968165650d1eb8a3ed2d64950f1a.mp4",
        "sha256": "0c9e6e3a7ec125637a995232f69af289ba07968165650d1eb8a3ed2d64950f1a",
        "etag": "4cb975af2800097d5b15b41858d0a873",
        "filename": "mapkai-under-the-blue-phone.mp4"
      },
      {
        "id": "hd",
        "label": {
          "zh": "1080p · 高清兼容版",
          "en": "1080p · Compatible HD"
        },
        "bytes": 91202733,
        "width": 1920,
        "height": 1080,
        "objectKey": "music-videos/under-the-blue/b0c4a4588c59010ee367d0067bedb3976f2a6abccb10c936918c274f6c924d01.mp4",
        "sha256": "b0c4a4588c59010ee367d0067bedb3976f2a6abccb10c936918c274f6c924d01",
        "etag": "6473c09b76fb71e6e393f39e8845dfc6",
        "filename": "mapkai-under-the-blue-hd.mp4"
      }
    ]
  },
  {
    "id": "leave-a-little-room",
    "title": {
      "zh": "Leave a Little Room",
      "en": "Leave a Little Room"
    },
    "description": {
      "zh": "MapKAI × MiniGrowLab 合作影像。从杯上的指纹到书页边注，给不同的理解留一点空间。",
      "en": "A MapKAI × MiniGrowLab collaboration. From fingerprints on a cup to notes in a margin, leave a little room for another reading."
    },
    "durationSeconds": 120.034,
    "version": "v2-minigrowlab",
    "poster": "/music/videos/posters/leave-a-little-room.jpg",
    "featured": true,
    "qualities": [
      {
        "id": "phone",
        "label": {
          "zh": "720p · 流畅版",
          "en": "720p · Smooth"
        },
        "bytes": 44708023,
        "width": 1280,
        "height": 720,
        "objectKey": "music-videos/leave-a-little-room/ad61a8f0ff15c8037cd3b35fae03f7cccb73e63cd117b8e3ae752e82baccbcc6.mp4",
        "sha256": "ad61a8f0ff15c8037cd3b35fae03f7cccb73e63cd117b8e3ae752e82baccbcc6",
        "etag": "c081d87b83d1dc96d9ea87fcc98e5147",
        "filename": "mapkai-leave-a-little-room-phone.mp4"
      },
      {
        "id": "hd",
        "label": {
          "zh": "1080p · 高清兼容版",
          "en": "1080p · Compatible HD"
        },
        "bytes": 79446889,
        "width": 1920,
        "height": 1080,
        "objectKey": "music-videos/leave-a-little-room/30244bef84769abb2ef2f0236a42e84ba51c29f62aba7cb6c4ca1b957129b07c.mp4",
        "sha256": "30244bef84769abb2ef2f0236a42e84ba51c29f62aba7cb6c4ca1b957129b07c",
        "etag": "5b78c54f10e80d3a7c3d62b628d07cfc",
        "filename": "mapkai-leave-a-little-room-hd.mp4"
      }
    ]
  },
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

export function findVideoQuality(id, quality) {
  const video = MUSIC_VIDEOS.find(item => item.id === id);
  const rendition = quality === undefined
    ? video?.qualities.find(item => item.id === 'hd') || video?.qualities[0]
    : video?.qualities.find(item => item.id === quality);
  return rendition ? { video, rendition } : null;
}

export function publicVideos() {
  return MUSIC_VIDEOS.map(({ id, title, description, durationSeconds, poster, featured, version, qualities }) => ({
    id, title, description, durationSeconds, poster, featured, version,
    qualities: [...qualities].sort((a, b) => Number(a.id !== 'hd') - Number(b.id !== 'hd')).map(({ id: quality, label, bytes, width, height }) => {
      const url = `/api/music/video?id=${encodeURIComponent(id)}&quality=${encodeURIComponent(quality)}&revision=${VIDEO_REVISION}`;
      return { id: quality, label, bytes, width, height, url };
    }),
  }));
}
