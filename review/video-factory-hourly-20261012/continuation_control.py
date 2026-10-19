"""Read-only decisions for the actual video heartbeat entry point.

This module does not start a service, touch a browser, acquire a lock, or send a
request. The current Codex turn executes its next action through the approved
interfaces and calls this guard again before each side effect.
"""

ALLOWED_ATTEMPTS = {
    "0222": "0222-3e9ff072-ba2a-400e-b04a-4136a679f426",
    "0223": "0223-af42a19f-8464-4d51-ae85-0f57558d4063",
}
ATTEMPT_PAYLOADS = {
    "0222": "d58c2238a52b95a3ac3a1a7232bfdf7cb5734fc8fdb92cfe4c99da0726641e2a",
    "0223": "89e8274e815645adb59afee218c70880cbdbca8c25e1dfdff9f4e1f8066b344c",
}
ALLOWED_ACTIONS = frozenset(("download", "verify", "upload", "marked_public_preview"))
NEXT_ACTION = {
    "READY_TO_DOWNLOAD": "download",
    "DOWNLOADED": "verify",
    "VERIFIED": "upload",
    "UPLOADED": "marked_public_preview",
}


def continuation_permission(authorization, code, request_id, action):
    """No expired schedule, quota snapshot, or queue row can expand this grant."""
    result = {
        "state": "CONTINUATION_DENIED",
        "productionAllowed": False,
        "code": code,
        "requestId": request_id,
        "action": action,
        "claimNewSubjects": False,
        "generate": False,
        "resubmitOriginal": False,
        "automationMayResume": False,
        "currentManualTurnOnly": True,
    }
    required = {
        "schemaVersion": "mapkai-manual-video-continuation.v1",
        "state": "ACTIVE_MANUAL_CONTINUATION",
        "authorizationSource": "DIRECT_HUMAN_MESSAGE_IN_CURRENT_CHAT",
        "ownerThreadId": "01a12c71-52dd-7273-90ef-bab05f5fc592",
        "scope": "CURRENT_MANUAL_TURN_ONLY",
        "currentManualTurnOnly": True,
        "claimNewSubjects": False,
        "generate": False,
        "resubmitOriginal": False,
        "automationMayResume": False,
        "automaticRenewal": False,
    }
    if any(authorization.get(key) != value for key, value in required.items()):
        return {**result, "reason": "MANUAL_AUTHORIZATION_INACTIVE_OR_SCOPE_CHANGED"}
    attempts = authorization.get("allowedAttempts")
    if not isinstance(attempts, list) or len(attempts) != len(ALLOWED_ATTEMPTS):
        return {**result, "reason": "ALLOWED_ATTEMPT_SET_CHANGED"}
    if any(not isinstance(item, dict) for item in attempts):
        return {**result, "reason": "ALLOWED_ATTEMPT_SET_CHANGED"}
    if {item.get("code"): item.get("requestId") for item in attempts} != ALLOWED_ATTEMPTS:
        return {**result, "reason": "ALLOWED_ATTEMPT_SET_CHANGED"}
    if {item.get("code"): item.get("payloadSha256") for item in attempts} != ATTEMPT_PAYLOADS:
        return {**result, "reason": "ALLOWED_ATTEMPT_SET_CHANGED"}
    actions = authorization.get("allowedActions")
    if not isinstance(actions, list) or set(actions) != ALLOWED_ACTIONS:
        return {**result, "reason": "ALLOWED_ACTION_SET_CHANGED"}
    if code not in ALLOWED_ATTEMPTS or request_id != ALLOWED_ATTEMPTS[code]:
        return {**result, "reason": "NOT_AN_AUTHORIZED_ORIGINAL_ATTEMPT"}
    if action not in ALLOWED_ACTIONS:
        return {**result, "reason": "NEW_CLAIM_GENERATION_OR_OTHER_ACTION_NOT_AUTHORIZED"}
    return {
        **result,
        "state": "AUTHORIZED_EXISTING_ATTEMPT_CONTINUATION",
        "productionAllowed": True,
        "reason": "NEW_DIRECT_HUMAN_INSTRUCTION_FOR_THIS_ORIGINAL_ATTEMPT",
    }


def plan_continuation(authorization, code, request_id, observation):
    """Choose the next stage without consulting nextScheduledLocal.

    An observation is a small actual status/receipt record, never a knowledge
    pack. A ready signal is consumed now; a provider wait receives a <=60 second
    local recheck, not an hour-bound stage gate. No automatic send is returned.
    """
    permission = continuation_permission(authorization, code, request_id, "verify")
    if not permission["productionAllowed"]:
        return {**permission, "nextAction": "stop", "nextDelaySeconds": None}
    if observation.get("requestId") != request_id:
        return {**permission, "productionAllowed": False, "state": "OBSERVATION_IDENTITY_MISMATCH", "nextAction": "stop", "nextDelaySeconds": None}
    phase = observation.get("phase")
    # The actual queue uses GENERATING; consume it as provider wait, never as a
    # reason to send again. Unknown outcome is recovery-only, even without the
    # transport's more specific RESULT_UNKNOWN spelling.
    if phase == "GENERATING":
        phase = "WAITING_PROVIDER"
    elif phase == "UNKNOWN":
        phase = "RESULT_UNKNOWN"
    base = {
        **permission,
        "phase": phase,
        "usesHourlyStageGate": False,
        "backgroundServiceStarted": False,
        "readLargeMaterials": False,
        "resubmitOriginal": False,
        "nextDelaySeconds": 0,
        "completionRequiresRealReceipt": True,
    }
    # A durable send intent with an indeterminate result always takes priority
    # over a cached phase, including a stale READY_TO_DOWNLOAD observation.
    if observation.get("resultUnknown") is True or phase == "RESULT_UNKNOWN":
        return {**base, "state": "RECOVER_ORIGINAL_RESULT", "nextAction": "recover_original_receipt", "releaseSharedWriterWhileWaiting": True}
    if phase == "PUBLIC_PREVIEW_VERIFIED":
        return {**base, "state": "COMPLETE_WITH_REAL_RECEIPT", "nextAction": "save_handoff_and_stop", "nextDelaySeconds": None}
    if phase == "READY" and observation.get("readyObserved") is True:
        phase = "READY_TO_DOWNLOAD"
        base["phase"] = phase
    if phase in NEXT_ACTION:
        return {**base, "state": "CONTINUE_NOW", "nextAction": NEXT_ACTION[phase], "releaseSharedWriterWhileWaiting": False}
    if phase == "WAITING_PROVIDER":
        if observation.get("readyObserved") is True:
            return {**base, "state": "CONTINUE_NOW", "nextAction": "download", "releaseSharedWriterWhileWaiting": False}
        return {
            **base,
            "state": "WAIT_FOR_ORIGINAL_PROVIDER",
            "nextAction": "check_original_status_only",
            "nextDelaySeconds": 60,
            "releaseSharedWriterWhileWaiting": True,
            "waitMechanism": "CURRENT_ACTIVE_CODEX_TURN_BOUNDED_WAIT_OR_REAL_PROVIDER_SIGNAL",
            "requiresAnotherTriggerIfTurnEnds": True,
        }
    if phase in ("LOGIN_REQUIRED", "CAPTCHA_REQUIRED", "SHARED_RESOURCE_OCCUPIED", "QUOTA_BLOCKED", "FAILED"):
        return {**base, "state": "PRESERVE_AND_REPORT_BLOCK", "nextAction": "save_original_request_and_specific_block", "nextDelaySeconds": None, "releaseSharedWriterWhileWaiting": True}
    return {**base, "productionAllowed": False, "state": "UNKNOWN_PHASE", "nextAction": "inspect_small_original_receipt_once", "nextDelaySeconds": None}


def claim_slot_decision(*, now, next_scheduled, served_hours, authorization_active,
                        new_subjects_allowed, end_at, shared_resource_free,
                        daily_submissions, hourly_submissions,
                        daily_limit=18, hourly_limit=2):
    """Future claim-only gate; deliberately separate from continuation.

    The current manual grant always passes new_subjects_allowed=False. This
    gate does not claim work or replace atomic shared locks/live quota checks.
    Late wakes may use the current scheduled hour, but never catch up old hours.
    """
    if not authorization_active or not new_subjects_allowed:
        return "NEW_SUBJECT_CLAIM_NOT_AUTHORIZED"
    if any(not isinstance(value, int) or value < 0 for value in (daily_submissions, hourly_submissions)):
        return "REAL_SUBMISSION_COUNTS_REQUIRED"
    if daily_limit > 18 or hourly_limit > 2 or daily_limit < 1 or hourly_limit < 1:
        return "EXISTING_LIMITS_CANNOT_BE_RAISED_HERE"
    if end_at is None or now >= end_at:
        return "AUTHORIZED_WINDOW_ENDED_OR_MISSING"
    if next_scheduled is None or now < next_scheduled:
        return "BEFORE_NEXT_CLAIM_SLOT"
    if next_scheduled.minute or next_scheduled.second or next_scheduled.microsecond:
        return "CLAIM_SLOT_MUST_BE_WHOLE_HOUR"
    current_hour = now.astimezone(next_scheduled.tzinfo).replace(minute=0, second=0, microsecond=0)
    if current_hour != next_scheduled:
        return "MISSED_SLOT_NO_CATCH_UP"
    hour_key = next_scheduled.isoformat()
    if hour_key in served_hours:
        return "CLAIM_SLOT_ALREADY_SERVED"
    if daily_submissions >= daily_limit or hourly_submissions >= hourly_limit:
        return "REAL_SUBMISSION_LIMIT_REACHED"
    if not shared_resource_free:
        return "SHARED_RESOURCE_OCCUPIED"
    return "CLAIM_SLOT_ELIGIBLE_REQUIRES_ATOMIC_LOCK_AND_LIVE_QUOTA"
