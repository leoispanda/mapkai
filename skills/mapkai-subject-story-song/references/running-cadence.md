# Selective running fit: 180 steps per minute

The owner reported running at 180 steps/minute on 2026-10-16 and clarified: consider it for songs that fit; lyrical or other songs that do not fit can be left alone. Briefly assess this during each new song's arrangement. Select the profile when its steady pulse naturally supports the genre, mood, vocal phrasing and learning content. If it would compromise those qualities, keep the natural arrangement and note that cadence fitting was skipped. Do not change the genre draw, discard a subject, accelerate dense teaching or remove expressive space just to hit 180. A lyrical song can still qualify if its natural pulse fits; lyricism alone is not an automatic exclusion.

This is a personal listening preference, not a universal cadence recommendation or a mandatory tempo for every song. A suitable new song need not have a separate ordinary version produced first. Explicitly requested alternate running editions retain independent recording identities and preserve older originals.

## Choose the pulse before composing

The target is three clear step cues per second, or one cue every one-third of a second. Choose one representation and explain it in the local song package:

| Requested tempo | Step mapping | Arrangement requirement |
| --- | --- | --- |
| 180 BPM | One quarter-note beat per step | Keep a clear, steady 180-per-minute pulse; melody and vocals may stretch across several beats. |
| 90 BPM | Two steps per quarter-note beat | Use an even, audible eighth-note pulse at 180 per minute. A 90 BPM kick alone supplies only one cue per two steps. |

For spacious bell-pop or acoustic indie folk, consider 90 BPM with light shakers, muted strums, soft percussion or a glassy pluck carrying the subdivisions. Memphis and other rhythmic styles can use either representation. Choose the one that makes the step cue easy to follow while retaining the selected style. Triplet decorations, syncopated bass and swing must not obscure or replace the even step pulse. Do not infer the running pulse from a genre name.

Keep the pulse recognizable across verses, the disciplinary bridge and the refrain. Bring it in early; avoid long beatless breaks, free-tempo passages, tempo ramps and sudden tempo changes in a cadence-led edition. Musical energy may change through harmony, orchestration and dynamics while the pulse stays steady. State any intentional pulse-free intro or ending in the planned arrangement.

Cadence does not set lyric speed. Keep a clear adult lead, natural English stress, breathable phrases and the existing everyday-meaning → disciplinary-method learning path. Simplify dense wording before accelerating delivery. Do not add left/right chants, turn the subject into a running lesson or discard the knowledge content merely to satisfy the tempo brief.

## Style-only prompt example

Choose and adapt one tempo brief, rather than putting ambiguous alternatives into the generation prompt:

> English acoustic indie folk at a steady 90 BPM in 4/4, with a clear even eighth-note shaker or muted guitar pulse at 180 per minute for a runner taking two steps per beat. Warm natural adult lead, relaxed melodic phrasing and clear English diction. Keep the step pulse audible through the verses, knowledge bridge and refrain; use harmonic and instrumental changes for lift, without tempo changes or long beatless breaks. Retain the approved learning lyrics.

For a 180 BPM edition, replace the tempo/mapping sentence with: “Steady 180 BPM in 4/4, one clear beat per running step, with spacious half-time vocal phrasing.” Specify the actual pulse instrument and the selected genre separately. Do not paste audit notes or this explanatory prose into the sung lyrics.

ElevenLabs documents tempo directions in a text prompt and section-level composition plans: [Music quickstart](https://elevenlabs.io/docs/eleven-api/guides/cookbooks/music) and [composition plans](https://elevenlabs.io/docs/eleven-api/guides/how-to/music/composition-plans). This guidance does not claim an exact-BPM guarantee or a dedicated BPM control in the owner's current browser interface. Keep the existing supported generation route and submission limits.

## Verify the recording, not the request

Save `useCase: running`, `targetCadenceSpm: 180`, `requestedTempoBpm`, `stepMapping` and the intended pulse instrument in the local package. These describe intent, not a measured result; no public database schema change is implied.

After a genuinely authorized generation, inspect the exact original recording. Check the audible pulse in more than one verse/chorus section and across transitions, using listening evidence and available local beat/timing analysis. Save the analysis method, inspected windows, observed tempo/pulse, drift or missing-pulse regions, and whether the words remain intelligible. A whole-song average alone cannot establish a steady running cue.

Automatic tempo estimates can differ by a factor of two. A reported 90 BPM is compatible with the 180-step target only when the recording actually contains the clear, even 180-per-minute subdivision; resolve the mapping from the audio. Do not report failure or success from a single tempo number, the prompt, the genre tag, requested section windows or an unperformed listening check. Mark `runningFitStatus` as `unverified`, `verified` or `off-target`, supported by the saved evidence. Leave it unverified when the available evidence cannot establish a reliable cue.

Preserve the original audio and existing editions. Off-target cadence is not permission to time-stretch, crop, regenerate or buy another variant; retain the actual result and follow the owner's original-recording policy. Use real running feedback to refine later suitable arrangements, while keeping the owner's selective scope. Cancelled production schedules stay cancelled.
