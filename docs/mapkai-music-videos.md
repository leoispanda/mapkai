# Music videos

Completed music videos live at `/music/videos/`. The Music library and the Arts and Humanities category (`/categories/02`) link to the collection. Leave a Little Room (MapKAI × MiniGrowLab) leads the collection, followed by the featured Your Turn / ASML cut; two earlier Your Turn cuts remain available as earlier versions. Resolution choices belong to one creative version.

`GET /api/music/videos` exposes a fixed public projection of the four entries. It does not list the R2 bucket. `/api/music/video?id=…&quality=phone|hd` streams only allowlisted immutable objects, validates their exact size and ETag, and supports GET, HEAD, conditional requests and a single byte range. All `download` parameters are rejected before storage access; the public catalogue exposes playback URLs only. Direct browser navigation to a media URL is rejected; normal inline video requests remain supported. Unknown identities, qualities or parameters cannot select storage objects.

The files use the existing private `MAPKAI_REVIEW_MEDIA` binding, a separate `music-videos/` namespace, and the existing shared D1 cost guard for every R2 operation. No bucket is made public. Videos do not modify the song catalogue, votes or song listening identities. In particular, the new ASML soundtrack is not registered as the older song 062.

The public collection, category entry and Music entry are bilingual. Video controls support inline phone playback, seeking, full screen and quality switching. No public download buttons, fallback links or attachment responses are offered. Native download menus are suppressed with `controlslist="nodownload"` where supported, and the video context menu is disabled. Playing a video pauses the music dock and other videos. Playback is user initiated; the initial page load fetches posters and metadata, not the full video files.

`scripts/build-music.mjs` copies the nested video UI and posters into `public/music/videos/`. Check the streaming contract with `node --test scripts/music-videos-api.test.mjs`, and preview local immutable source files with `MUSIC_VIDEO_LOCAL_PREVIEW=1 PORT=3118 node server.js`. The preview switch exists only in the local Node server, never in the deployed Worker.

Illustrations are AI-assisted artistic interpretations. They are not archival photographs or technical equipment diagrams. Earlier cuts retain their earlier music and cast; they are labelled accordingly.

All four films include a small permanent “AI generated” mark in the top-right corner of the video itself, including full-screen playback. The original marked export files remain preserved privately. The card also carries an English AI-generated badge in both language modes. The marked renditions copy the existing AAC packets and audio timestamps unchanged. Playback URLs use a fixed `revision` value for cache updates. The previous AI-label revision remains accepted for existing inline players; arbitrary revisions are rejected. Request context participates in the media cache key through `Vary`.

The collection is intended for online viewing. These controls remove direct download affordances; they are not DRM and do not claim to prevent recording or deliberate extraction of media already delivered for playback.

The Leave a Little Room collaboration uses the original song 009 and lyrics, 36 illustrations and 50 shots. Its default 720p rendition runs at 60 fps; the 1080p choice is the 30 fps compatibility export. The private 1080p60 master remains outside the public collection. Both public renditions retain continuous MapKAI × MiniGrowLab attribution and the AI-generated mark. Publication adds immutable media objects without replacing the existing Your Turn renditions.
