# Failure Diagnoser Prompt · v1.0

Classify the primary failure as one of: `EDITORIAL_GUIDANCE_FAILURE`, `KNOWLEDGE_PACK_FAILURE`, `VIDEO_PROMPT_FAILURE`, `GENERATION_VARIANCE_FAILURE`, or `FACTUAL_FAILURE`. Return strict `schemas/failure-diagnosis.schema.json` JSON with evidence, root cause, repair target, bounded repair instructions, and whether to regenerate the same payload once. Do not repair factual problems by changing the cinematic prompt. Respect the configured retry and repair budgets.

