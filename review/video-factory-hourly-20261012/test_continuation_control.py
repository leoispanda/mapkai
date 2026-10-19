"""Contract tests: no browser, remote account, queue writes or production work."""
import copy
import json
from datetime import datetime, timedelta
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from shutil import copy2

from continuation_control import continuation_permission, plan_continuation, claim_slot_decision


HERE = Path(__file__).resolve().parent
REQUEST = '0222-3e9ff072-ba2a-400e-b04a-4136a679f426'
# Test authorization is deliberately independent of the live grant, which must
# become COMPLETE after delivery without making these contracts fail.
AUTH = {
    'schemaVersion': 'mapkai-manual-video-continuation.v1',
    'state': 'ACTIVE_MANUAL_CONTINUATION',
    'authorizationSource': 'DIRECT_HUMAN_MESSAGE_IN_CURRENT_CHAT',
    'ownerThreadId': '01a12c71-52dd-7273-90ef-bab05f5fc592',
    'scope': 'CURRENT_MANUAL_TURN_ONLY',
    'currentManualTurnOnly': True,
    'claimNewSubjects': False,
    'generate': False,
    'resubmitOriginal': False,
    'automationMayResume': False,
    'automaticRenewal': False,
    'allowedActions': ['download', 'verify', 'upload', 'marked_public_preview'],
    'allowedAttempts': [
        {'code': '0222', 'requestId': REQUEST, 'payloadSha256': 'd58c2238a52b95a3ac3a1a7232bfdf7cb5734fc8fdb92cfe4c99da0726641e2a'},
        {'code': '0223', 'requestId': '0223-af42a19f-8464-4d51-ae85-0f57558d4063', 'payloadSha256': '89e8274e815645adb59afee218c70880cbdbca8c25e1dfdff9f4e1f8066b344c'},
    ],
}


class ContinuationControlTest(unittest.TestCase):
    def isolated_entry(self, authorization):
        directory = tempfile.TemporaryDirectory(prefix='mapkai-continuation-test-')
        self.addCleanup(directory.cleanup)
        root = Path(directory.name)
        for name in ('overnight-window-20261018.py', 'overnight-window-20261018.json', 'continuation_control.py'):
            copy2(HERE / name, root / name)
        (root / 'manual-continuation-20261019.json').write_text(json.dumps(authorization))
        return [sys.executable, str(root / 'overnight-window-20261018.py')]

    def test_exact_existing_attempts_and_actions_only(self):
        for attempt in AUTH['allowedAttempts']:
            for action in AUTH['allowedActions']:
                self.assertTrue(continuation_permission(AUTH, attempt['code'], attempt['requestId'], action)['productionAllowed'])
        for code, request, action in [('0224', REQUEST, 'upload'), ('0222', REQUEST + '-retry', 'upload'), ('0223', REQUEST, 'verify'), ('0222', REQUEST, 'generate'), ('0222', REQUEST, 'claim'), ('0222', REQUEST, 'creator')]:
            with self.subTest(code=code, request=request, action=action):
                self.assertFalse(continuation_permission(AUTH, code, request, action)['productionAllowed'])

    def test_scope_cannot_expand_or_continue_after_closure(self):
        for key, value in [('state', 'COMPLETE'), ('generate', True), ('claimNewSubjects', True), ('automationMayResume', True), ('currentManualTurnOnly', False)]:
            auth = {**AUTH, key: value}
            self.assertFalse(continuation_permission(auth, '0222', REQUEST, 'upload')['productionAllowed'])
        for mutation in ('add_attempt', 'replace_attempt', 'payload', 'extra_action'):
            auth = copy.deepcopy(AUTH)
            if mutation == 'add_attempt':
                auth['allowedAttempts'].append({'code': '0224', 'requestId': 'another'})
            elif mutation == 'replace_attempt':
                auth['allowedAttempts'][0]['requestId'] += '-retry'
            elif mutation == 'payload':
                auth['allowedAttempts'][0]['payloadSha256'] = '0' * 64
            else:
                auth['allowedActions'].append('generate')
            self.assertFalse(continuation_permission(auth, '0222', REQUEST, 'upload')['productionAllowed'])

    def test_ready_successors_continue_without_hourly_gate(self):
        for phase, next_action in [('READY_TO_DOWNLOAD', 'download'), ('DOWNLOADED', 'verify'), ('VERIFIED', 'upload'), ('UPLOADED', 'marked_public_preview')]:
            plan = plan_continuation(AUTH, '0222', REQUEST, {'requestId': REQUEST, 'phase': phase, 'nextScheduledLocal': '2099-01-01T00:00:00Z'})
            self.assertEqual(plan['nextAction'], next_action)
            self.assertEqual(plan['nextDelaySeconds'], 0)
            self.assertFalse(plan['usesHourlyStageGate'])
            self.assertFalse(plan['backgroundServiceStarted'])

    def test_unknown_send_result_never_resubmits_even_with_stale_ready(self):
        plan = plan_continuation(AUTH, '0222', REQUEST, {'requestId': REQUEST, 'phase': 'READY_TO_DOWNLOAD', 'resultUnknown': True})
        self.assertEqual(plan['nextAction'], 'recover_original_receipt')
        self.assertFalse(plan['resubmitOriginal'])
        unknown = plan_continuation(AUTH, '0222', REQUEST, {'requestId': REQUEST, 'phase': 'UNKNOWN'})
        self.assertEqual(unknown['nextAction'], 'recover_original_receipt')

    def test_provider_wait_is_small_original_status_check(self):
        plan = plan_continuation(AUTH, '0222', REQUEST, {'requestId': REQUEST, 'phase': 'WAITING_PROVIDER', 'unchangedChecks': 100})
        self.assertEqual(plan['nextAction'], 'check_original_status_only')
        self.assertEqual(plan['nextDelaySeconds'], 60)
        self.assertFalse(plan['readLargeMaterials'])
        self.assertTrue(plan['releaseSharedWriterWhileWaiting'])
        self.assertTrue(plan['requiresAnotherTriggerIfTurnEnds'])
        ready = plan_continuation(AUTH, '0222', REQUEST, {'requestId': REQUEST, 'phase': 'WAITING_PROVIDER', 'readyObserved': True})
        self.assertEqual(ready['nextAction'], 'download')
        self.assertEqual(ready['nextDelaySeconds'], 0)
        generating = plan_continuation(AUTH, '0222', REQUEST, {'requestId': REQUEST, 'phase': 'GENERATING'})
        self.assertEqual(generating['nextAction'], 'check_original_status_only')
        self.assertEqual(generating['nextDelaySeconds'], 60)
        ready_alias = plan_continuation(AUTH, '0222', REQUEST, {'requestId': REQUEST, 'phase': 'READY', 'readyObserved': True})
        self.assertEqual(ready_alias['nextAction'], 'download')
        self.assertEqual(ready_alias['nextDelaySeconds'], 0)

    def test_real_identity_required_and_completion_stops(self):
        bad = plan_continuation(AUTH, '0222', REQUEST, {'requestId': 'different', 'phase': 'UPLOADED'})
        self.assertFalse(bad['productionAllowed'])
        done = plan_continuation(AUTH, '0222', REQUEST, {'requestId': REQUEST, 'phase': 'PUBLIC_PREVIEW_VERIFIED'})
        self.assertEqual(done['nextAction'], 'save_handoff_and_stop')
        self.assertIsNone(done['nextDelaySeconds'])

    def test_claim_gate_is_separate_and_preserves_existing_limits(self):
        slot = datetime.fromisoformat('2026-10-19T06:00:00+02:00')
        context = dict(now=slot + timedelta(minutes=5), next_scheduled=slot, served_hours=[], authorization_active=True, new_subjects_allowed=True, end_at=slot + timedelta(hours=1), shared_resource_free=True, daily_submissions=5, hourly_submissions=0)
        self.assertEqual(claim_slot_decision(**context), 'CLAIM_SLOT_ELIGIBLE_REQUIRES_ATOMIC_LOCK_AND_LIVE_QUOTA')
        cases = [
            ({'new_subjects_allowed': False}, 'NEW_SUBJECT_CLAIM_NOT_AUTHORIZED'),
            ({'served_hours': [slot.isoformat()]}, 'CLAIM_SLOT_ALREADY_SERVED'),
            ({'now': slot - timedelta(seconds=1)}, 'BEFORE_NEXT_CLAIM_SLOT'),
            ({'now': slot + timedelta(hours=1), 'end_at': slot + timedelta(hours=2)}, 'MISSED_SLOT_NO_CATCH_UP'),
            ({'end_at': slot + timedelta(minutes=5)}, 'AUTHORIZED_WINDOW_ENDED_OR_MISSING'),
            ({'shared_resource_free': False}, 'SHARED_RESOURCE_OCCUPIED'),
            ({'daily_submissions': 18}, 'REAL_SUBMISSION_LIMIT_REACHED'),
            ({'hourly_submissions': 2}, 'REAL_SUBMISSION_LIMIT_REACHED'),
            ({'daily_submissions': -1}, 'REAL_SUBMISSION_COUNTS_REQUIRED'),
            ({'daily_limit': 19}, 'EXISTING_LIMITS_CANNOT_BE_RAISED_HERE'),
        ]
        for changes, expected in cases:
            with self.subTest(changes=changes):
                self.assertEqual(claim_slot_decision(**{**context, **changes}), expected)

    def test_actual_entry_default_stays_expired_and_explicit_mode_is_wired(self):
        command = self.isolated_entry(AUTH)
        default = json.loads(subprocess.check_output(command, text=True))
        self.assertEqual(default['state'], 'EXPIRED')
        self.assertFalse(default['productionAllowed'])
        allowed = json.loads(subprocess.check_output(command + ['--continuation', '--code', '0222', '--request-id', REQUEST, '--action', 'upload'], text=True))
        self.assertTrue(allowed['productionAllowed'])
        self.assertFalse(allowed['automationMayResume'])
        denied = json.loads(subprocess.check_output(command + ['--continuation', '--code', '0222', '--request-id', REQUEST, '--action', 'generate'], text=True))
        self.assertFalse(denied['productionAllowed'])
        malformed = subprocess.run(command + ['--action', 'upload'], capture_output=True, text=True)
        self.assertNotEqual(malformed.returncode, 0)

    def test_complete_grant_refuses_actual_entry_actions_and_plans(self):
        command = self.isolated_entry({**AUTH, 'state': 'COMPLETE'})
        for attempt in AUTH['allowedAttempts']:
            for action in AUTH['allowedActions']:
                result = json.loads(subprocess.check_output(command + ['--continuation', '--code', attempt['code'], '--request-id', attempt['requestId'], '--action', action], text=True))
                self.assertFalse(result['productionAllowed'])
                self.assertEqual(result['reason'], 'MANUAL_AUTHORIZATION_INACTIVE_OR_SCOPE_CHANGED')
            observation = Path(command[1]).with_name('observation.json')
            observation.write_text(json.dumps({'requestId': attempt['requestId'], 'phase': 'VERIFIED'}))
            plan = json.loads(subprocess.check_output(command + ['--continuation', '--plan', '--code', attempt['code'], '--request-id', attempt['requestId'], '--observation', str(observation)], text=True))
            self.assertFalse(plan['productionAllowed'])
            self.assertEqual(plan['nextAction'], 'stop')


if __name__ == '__main__':
    unittest.main()
