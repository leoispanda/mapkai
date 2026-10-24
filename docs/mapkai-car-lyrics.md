# Opt-in car lyrics

Music and the shared dock expose “车载歌词（试用） / Car lyrics (trial)”. It is off by default and remembered locally as `mapkaiMusicCarLyrics.v1`. Enabling it never starts, seeks, regenerates or edits audio, loads a catalogue by itself, or changes server records. The Music control delegates to the existing dock; it does not create another playing audio element.

The dock submits the current timed phrase through Media Session `title`; the short song title and MapKAI go in `artist`. Only a changed phrase or song causes a metadata write. Native playback progress, seeks and visibility changes refresh the selection. Pauses, gaps, completion, disabled mode and page exit restore the song title. A dormant player and external lesson/video owner retain their controls. Untimed songs continue to publish their titles.

This is a browser implementation of dynamic title metadata, not a verified reproduction of NetEase or Spotify internals. The owner reports both apps display lyrics on their iPhone-to-Renault-Clio Bluetooth setup. Browser and native-app capabilities differ. Real iPhone foreground/locked-screen delivery, the car’s layout, truncation and background updates still require hardware testing. There is no receipt API proving that a head unit displayed a submitted title. No busy timers, fake silent audio, background-permission changes or native-app installation are introduced.

## Your Turn: Science & ASML

The original 064 recording and full written lyrics remain unchanged. `_performance-captions.js` adds a separate `lyricCaptions` response field only for ID `efc8308c-614f-4845-94ce-3b32425c2e4a`, matching audio ETag `9cdf198a59ac0e6bdf48bff5e4b12536` and size 2,801,799 bytes. Its SHA-256 is `f08ad85a94f600cd1f61c96bff7266a234730f79e99e445c91e5f3f6f459d6b0`. This prevents another recording/version from acquiring its times.

These are the existing MV’s 36 phrase subtitles, reused without a new transcription or fabricated full-manuscript timing. Approximate timing and two ellipses remain disclosed. The subtitle cue set covers recognized performance text; it does not claim a complete or word-perfect transcript. Unsung manuscript hook lines receive no invented times. No caption is shown after 100.260 seconds, leaving the original orchestral ending untimed. Full original lyrics remain in their own disclosure. An already validated complete original lyric timeline takes precedence over this optional fallback.

## Verification

`node --test scripts/music-dock.test.mjs scripts/music-playback.test.mjs scripts/music-lyrics-sync.test.mjs scripts/music-performance-captions.test.mjs scripts/music-api.test.mjs`

Tests exercise the production player sources: opt-in/persistence, native progress, gaps, forward/backward seeks, pause/resume, queue changes, no second playing audio, missing timing, external ownership and cleanup. The captions use the same strict complete-line structural validator as other timed text. Browser QA observes actual audio progress, the visible current line and a narrow layout; it does not certify iPhone or car behavior.

[W3C Media Session](https://www.w3.org/TR/mediasession/) defines mutable display metadata and platform-controlled presentation. [Apple Now Playing information](https://developer.apple.com/documentation/mediaplayer/mpnowplayinginfocenter) describes native-app metadata and accessory display; it does not grant that API to a webpage.
