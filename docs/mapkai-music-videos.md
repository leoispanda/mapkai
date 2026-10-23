# Music videos

Completed music videos live at `/music/videos/`. The Music library and the Arts and Humanities category (`/categories/02`) link to the collection. The latest Your Turn / ASML cut is featured; two earlier finished cuts remain available as earlier versions. Resolution choices belong to one creative version.

`GET /api/music/videos` exposes a fixed public projection of the three entries. It does not list the R2 bucket. `/api/music/video?id=…&quality=phone|hd` streams only allowlisted immutable objects, validates their exact size and ETag, and supports GET, HEAD, conditional requests and a single byte range. `download=1` returns an attachment with a safe filename. Unknown identities, qualities or parameters cannot select storage objects.

The files use the existing private `MAPKAI_REVIEW_MEDIA` binding, a separate `music-videos/` namespace, and the existing shared D1 cost guard for every R2 operation. No bucket is made public. Videos do not modify the song catalogue, votes or song listening identities. In particular, the new ASML soundtrack is not registered as the older song 062.

The public collection, category entry and Music entry are bilingual. Video controls support inline phone playback, seeking, full screen and downloads. Playing a video pauses the music dock and other videos. Playback is user initiated; the initial page load fetches posters and metadata, not the full video files.

`scripts/build-music.mjs` copies the nested video UI and posters into `public/music/videos/`. Check the streaming contract with `node --test scripts/music-videos-api.test.mjs`, and preview local immutable source files with `MUSIC_VIDEO_LOCAL_PREVIEW=1 PORT=3118 node server.js`. The preview switch exists only in the local Node server, never in the deployed Worker.

Illustrations are AI-assisted artistic interpretations. They are not archival photographs or technical equipment diagrams. Earlier cuts retain their earlier music and cast; they are labelled accordingly.
