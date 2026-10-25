# Content overview

`/toolbox/overview/` and `/toolbox/overview/en/` present a navigable mind map of the current subjects, learning fields and stories. The initial graph shows all 11 subject branches around MapKAI. Select a branch to focus its fields, then expand a field into three story nodes. Expand fields shows the full 80-field graph. Selected content actions appear directly above the map. Courses, songs and music videos remain accessible from the same page.

The map uses a locally served, pinned D3 7.9.0 bundle (`vendor/`, ISC licence included). `graph.js` lays out two-sided trees, renders SVG nodes and connectors, and supports drag, wheel/pinch zoom, fit, zoom buttons and keyboard navigation. Phone layouts use vertical branches with readable text and native single-finger page scrolling. No third-party runtime, external account or new service is required.

Fields retain the music/video/story status lights and three smaller story lights, with newer/earlier story counts. Prepared drafts are labelled separately from readable articles; hidden story bodies are not exported or linked. Shared group songs, recordings, creative video versions and quality options remain separate counts.

`scripts/build-content-overview.mjs` derives title-only navigation metadata from the canonical taxonomy, story visibility gate and song catalogue. The page refreshes songs from the current public static song catalogue, reads the existing public subject-video catalogue once and uses the existing music-video projection. Failed video reads remain unverified; video-dependent filters stay disabled rather than reporting zero availability. No media bytes or private factory records are exported.

Search covers both languages, story concepts and song names. Filters cover complete resource sets, videos, shared songs and earlier story versions. Existing public share and course routes supply the destinations.

The Corporate Finance entrance keeps the existing EMBA password gate and is labelled accordingly. The overview does not alter access controls or make protected lesson text readable.

`node scripts/build-toolbox.mjs --landing-only` rebuilds the Toolbox entry and this directory without rebuilding unrelated tool modules. Full Toolbox/public UI builds include the same overview automatically. The directory contains only source UI and generated title metadata; the build copies an explicit public-file allowlist.
