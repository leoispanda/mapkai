# Cloudflare media cost protection

This protects the current MapKAI and Turnpo R2 application paths. DishKAI has no
R2 dependency; retain Workers Free so its Cloudflare compute, KV and AI quotas
stop requests rather than accrue paid overages. Third-party AI quotas are
managed separately and are unchanged by this deployment.

There is no account-wide euro invoice cap in Cloudflare. The €10/month goal is
implemented with conservative usage allowances before accessing paid R2:

| Shared allowance | Limit |
| --- | --- |
| R2 Class A operations (PUT/LIST) | 100,000 per cycle |
| R2 Class B operations (GET/HEAD) | 8,000,000 per cycle |
| New uploaded bytes | 512 MiB per cycle |
| Lifetime conservative storage reservation | 8 GiB |
| Initial reservation from the five-bucket audit | 3 GiB (actual audit: 2.74 GB) |

The cycle starts on day 7 UTC, matching the observed R2 subscription billing
cycle. Reservations are atomic and precede each operation. Failed operations
and overwrites are counted conservatively; deleting files does not replenish
the allowance. Storage reservations persist across monthly resets. Missing,
unavailable or exhausted protection returns 503 or 429 before accessing R2.
The provider's free allowance period and billing rounding can differ; these
limits are usage safeguards, not a guarantee of a €10 invoice.

## Resources and routes

- Dedicated D1 `cloudflare-cost-guard`, ID `3bd3d71b-196b-462c-9b19-6a19e8b6255b`.
- Every protected function requires `CLOUDFLARE_COST_DB` bound to that database.
- `media.mapkai.com/*`: read-only gateway for `mapkai-finance-media`.
- `media.turnpo.com/*`: read-only gateway for `turnpo-media`.
- MapKAI factory routes: protected `mapkai-video-review` reads and review writes.
- Turnpo profile and EMBA routes: protected profile uploads/media, EMBA uploads,
  private downloads and Europe Forum assets.
- All five buckets' `r2.dev` access must remain disabled. Disable public access
  on the two R2 custom domains while retaining their DNS records; the Worker
  serves those URLs through private R2 bindings. Worker routes and Pages must
  use **Fail closed**, never origin fallback after quota exhaustion.

Keep Workers Free. Do not enable a paid product or a new public R2 endpoint
without extending this audit and protection first. Account owners' direct S3,
dashboard or CLI operations bypass application code; existing trusted upload
tools must be audited and reserved separately before large uploads. This
gateway never accepts public PUT or multipart requests.

## Validation

Run `node --test tools/cloudflare-cost-guard/shared/cost-guard.test.mjs
tools/cloudflare-cost-guard/media-worker.test.mjs` (Node 22+, Python 3 SQLite).
`COST_GUARD_TEST_PYTHON` selects the Python executable if needed. Tests exercise
real concurrent SQLite reservations, resets, upload bytes, route authorization,
storage failures, range requests and fail-closed behavior.

Deploy the schema before the code. Deploy media routes before disabling R2
custom-domain public access, then verify HEAD, small range GET, conditional GET,
unsupported methods and missing objects on both existing URLs. Inspect the
single ledger row to confirm all gateways count in the same database. Website
deployment must preserve current production asset hashes and unrelated work.

## Sources

- [Cloudflare budget alerts](https://developers.cloudflare.com/billing/manage/budget-alerts/)
- [R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- [Workers Free quotas and fail closed](https://developers.cloudflare.com/workers/platform/limits/)
- [R2 public-domain access](https://developers.cloudflare.com/r2/buckets/public-buckets/)
