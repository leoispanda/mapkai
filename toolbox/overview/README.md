# Content overview

`/toolbox/overview/` and `/toolbox/overview/en/` present all 80 learning fields expanded by default, grouped into 11 connected subject branches. Each field shows named music/video/story lights, an explicit complete/missing-resource status, and three smaller story lights individually marked newer or earlier. These states are visible without hovering. Courses, songs and music videos remain accessible from the same page.

The map uses a locally served, pinned D3 7.9.0 bundle (`vendor/`, ISC licence included). `graph.js` arranges unboxed SVG branch groups in responsive columns while preserving readable 15px field labels and native document scrolling. Text-size controls reflow the branches. Subject navigation scrolls to a branch; field selection keeps its peers visible, expands its three story titles and opens a closable detail panel with the existing content actions. Story tags also open the individual version and reading state. Keyboard focus returns to the selected node when the panel closes. No third-party runtime, external account or new service is required.

Prepared drafts are labelled separately from readable articles; hidden story bodies are not exported or linked. Shared group songs, recordings, creative video versions and quality options remain separate counts.

`scripts/build-content-overview.mjs` derives title-only navigation metadata from the canonical taxonomy, story visibility gate and song catalogue. The page refreshes songs from the current public static song catalogue, reads the existing public subject-video catalogue once and uses the existing music-video projection. Failed video reads remain unverified; video-dependent filters stay disabled rather than reporting zero availability. No media bytes or private factory records are exported.

Search covers both languages, story concepts and song names, and reveals matching story titles. Filters cover all fields, complete resource sets, missing music, missing video, available videos, shared songs and earlier story versions. Missing music and missing video may overlap. The optional subjects-only view is temporary; reload and reset restore all 80 fields. Existing public share and course routes supply the destinations.

The Corporate Finance entrance keeps the existing EMBA password gate and is labelled accordingly. The overview does not alter access controls or make protected lesson text readable.

`node scripts/build-toolbox.mjs --landing-only` rebuilds the Toolbox entry and this directory without rebuilding unrelated tool modules. Full Toolbox/public UI builds include the same overview automatically. The directory contains only source UI and generated title metadata; the build copies an explicit public-file allowlist.
