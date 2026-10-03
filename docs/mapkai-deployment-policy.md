# MapKAI deployment policy

The verified Git publication repository is `/Users/leoyang/iCloud Drive (Archive) - 1/Documents/mapkai`, remote `git@github.com:leoispanda/mapkai.git`, production branch `main`. The `Documents/mapkai/atlas-redesign` directory is a separate preparation copy. A preparation copy can contain newer approved content than Git.

Cloudflare serves the checked-in `public/` snapshot and compiles `functions/`. Its current build command is `exit 0`, with output directory `public`. Restore or generate all dependent public files before pushing a website change. Keep root editable files and public mirrors synchronized. `npm run build` now builds Finance, Speaking Studio, Toolbox and the common UI; the framework story inputs are under `content/framework-stories/` and do not depend on private review directories.

Before publishing, compare the current production version and core asset hashes with the Git snapshot. If production came from a newer direct upload, synchronize that approved release into Git first. A clean Git working tree alone does not establish that Git is newer than production.

Cloudflare build-watch exclusions are `docs/*`, `review/*`, `question-banks/*`, `README.md`, `MAPKAI_MEMORY.md` and `MAPKAI_QUESTION_BANK_FOR_GPT.txt`. A push containing only these files skips the website build. Other source paths keep their existing deployment behavior. Changing candidate question files does not activate them in the site.

For the 2026-10-03 incident, commit `1a57f54` changed only question-bank material, but automatic Git deployment used the older v0.1.225 public snapshot and replaced the newer directly uploaded v0.1.291 site. Production was restored to the verified successful deployment `2d8054fa-aa85-4006-adce-7154abba9d7f`. The v0.1.291 website, approved stories, API sources and editable build inputs are synchronized into Git in the recovery commit.

The restoration evidence and complete public hash inventory are in [the recovery manifest](releases/mapkai-restoration-2026-10-04.json). Keep unrelated pending work outside a recovery commit. Preserve production snapshot bytes during restoration; asset-version generation can be verified in an isolated directory.
