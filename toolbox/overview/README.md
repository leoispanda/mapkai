# Content overview

`/toolbox/overview/` and `/toolbox/overview/en/` open on the complete radial atlas: MapKAI at the centre, all 11 subjects, all 80 fields, 240 resource lights and 240 individual story lights inside the initial canvas. There is no initial cropped reading mode. Selecting a subject, field or story zooms into its details; Show all, Home and the root restore the complete overview. Other fields stay expanded while zooming.

Each field has two compact rows: its name, then three resource lights in Music / Video / Stories order followed by three individual story lights with plain New/Old text. The canvas key explains this fixed order. Story version labels have no coloured background or character boxes. The complete view uses the available screen area; label sizes adapt to the viewport, with larger text on desktop and tap-to-zoom detail on small screens. Small screens use short category headings; all 80 field names remain intact.

The locally served, pinned D3 7.9.0 bundle (`vendor/`, ISC licence included) provides the camera. `graph.js` places subjects around the central hub, then packs upright field-label rectangles near their radial branches while avoiding overlaps and respecting the canvas bounds. It reduces spacing and typography only when the complete layout requires it. The full layout is cached by viewport size; filters and later resource updates retain stable positions. The minimap appears while zoomed and stays hidden in the full overview so it cannot cover any fields. Drag, wheel, phone pan/pinch, zoom controls, keyboard navigation and fullscreen remain available. Fullscreen includes the resource/story detail panel.

A solid green circle means the resource exists, a solid red circle means it is needed, and a hollow grey dashed circle means the state has not been verified. All six circles remain present for every field. Readiness colour is independent of the New/Old text: an earlier prepared story still has a green light. Detail-panel circles follow the same rule.

Prepared drafts are labelled separately from readable articles; hidden story bodies are not exported or linked. Shared group songs, recordings, creative video versions and quality options remain separate counts. The Corporate Finance entrance retains the existing EMBA password gate.

`scripts/build-content-overview.mjs` derives title-only metadata from the canonical taxonomy, story visibility gate and song catalogue. The page refreshes songs from the current public static song catalogue and reads the existing public subject-video catalogue and music-video projection. Failed video reads remain unverified and video-dependent filters stay disabled. No media bytes or private factory records are exported.

Search covers both languages, concepts and song names. Filters cover all fields, complete resource sets, missing music/video, available videos/shared songs and earlier story versions. The optional subjects-only view is temporary; reset and reload restore the complete 80-field atlas. Explanatory notes sit below the map in an expandable legend.

`node scripts/build-content-overview.mjs` rebuilds this directory alone. Full Toolbox/public UI builds include it automatically and copy an explicit public-file allowlist.
