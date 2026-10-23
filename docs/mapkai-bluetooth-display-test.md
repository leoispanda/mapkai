# Bluetooth text display diagnostic

`/music/bluetooth/` is a user-initiated diagnostic for an iPhone connected by Bluetooth to a Renault Clio. It plays the existing, immutable 064 ASML audio and changes Media Session title metadata to `MapKAI TEST 1` through `4`, one phase per five seconds of audio playback. At twenty seconds of observed playback, it pauses and restores the song title. The user can stop at any time. No song bytes, lyrics, timing or catalogue entries are changed.

The page reports only that metadata was submitted to the local browser. It cannot detect receipt by an iPhone lock screen or car head unit. It makes no claim of Renault compatibility or completed lyrics support. Users compare foreground and locked-phone results. Browser background suspension can affect updates and automatic stopping; foregrounding rechecks the audio position. An unsupported browser does not start a misleading test. All timers stop on cancellation, playback error, completion or page exit. A replacement metadata owner is not overwritten on cleanup.

The page is separate from the regular player and does not load the music dock. Standard music playback remains unchanged. The Music page contains a bilingual diagnostic link. The new page has no analytics or feedback-submission endpoint. Its sample audio is the already published 064 recording; it does not invoke generation, transcription or song-listening event writes.

Run `node --test scripts/music-bluetooth.test.mjs`. Controller tests cover phase transitions, completion, pause, unsupported browsers, rejected and late play requests, ownership and cleanup. Browser QA verifies the visible test phases and restoration; physical iPhone-to-Clio compatibility requires the owner's test. Existing 063/064 records have original lyrics but no validated synchronized timing, so this diagnostic does not infer or fabricate lyric timestamps.

References: [W3C Media Session](https://www.w3.org/TR/mediasession/), [Renault EASY LINK music information](https://www.user-manual.renault.com/fr/content/easy-link/audiomultimedia/musique). The exact Clio year and head unit are unknown; no particular EASY LINK version is assumed.
