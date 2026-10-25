# Content overview

`/toolbox/overview/` and `/toolbox/overview/en/` show a radial mind map with MapKAI at its centre, 11 subjects around the hub and all 80 learning fields expanded by default. The branches occupy all four quadrants. Each field retains named music/video/story lights, an explicit complete/missing-resource status, and three smaller story lights individually marked newer or earlier. Courses, songs and music videos remain accessible from the same page.

The map uses the locally served, pinned D3 7.9.0 bundle (`vendor/`, ISC licence included). `graph.js` seeds branches around the central hub and deterministically separates upright label rectangles. Field positions are cached across resource updates and filters. The camera supports mouse drag, wheel, phone pan/pinch, zoom buttons, keyboard arrows, Home, a clickable minimap and fullscreen. Show all restores the complete centred graph. Subject navigation and node selection focus the camera while retaining the other fields. Small search result sets receive a closer view. Fullscreen retains both navigation controls and the story/resource detail panel.

The page preserves the existing shared navigation. Its map controls follow the visible header and filter bar when the page scrolls. Selecting a field opens three story titles and the existing content actions in a closable panel; individual story lights also open their version and reading state. Closing returns keyboard focus to the selected node. No external account or new service is required.

Prepared drafts are labelled separately from readable articles; hidden story bodies are not exported or linked. Shared group songs, recordings, creative video versions and quality options remain separate counts.

`scripts/build-content-overview.mjs` derives title-only navigation metadata from the canonical taxonomy, story visibility gate and song catalogue. The page refreshes songs from the current public static song catalogue, reads the existing public subject-video catalogue once and uses the existing music-video projection. Failed video reads remain unverified; video-dependent filters stay disabled rather than reporting zero availability. No media bytes or private factory records are exported.

Search covers both languages, story concepts and song names, and focuses matching branches. Filters cover all fields, complete resource sets, missing music, missing video, available videos, shared songs and earlier story versions. Missing music and missing video may overlap. The optional subjects-only view is temporary; reload and reset restore all 80 fields. Existing public share and course routes supply the destinations.

The Corporate Finance entrance keeps the existing EMBA password gate and is labelled accordingly. The overview does not alter access controls or make protected lesson text readable.

`node scripts/build-toolbox.mjs --landing-only` rebuilds the Toolbox entry and this directory without rebuilding unrelated tool modules. Full Toolbox/public UI builds include the same overview automatically. The directory contains only source UI and generated title metadata; the build copies an explicit public-file allowlist.
