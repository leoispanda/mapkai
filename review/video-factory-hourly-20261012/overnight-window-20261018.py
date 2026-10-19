"""Existing heartbeat guard; default expired-window behavior is unchanged.

--continuation is a new direct human grant for two existing original attempts,
not an extension of the old overnight production window or an automation start.
"""
import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

from continuation_control import continuation_permission, plan_continuation


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--continuation', action='store_true')
    parser.add_argument('--code')
    parser.add_argument('--request-id')
    parser.add_argument('--action')
    parser.add_argument('--plan', action='store_true')
    parser.add_argument('--observation', type=Path)
    args = parser.parse_args()
    now = datetime.now(timezone.utc)
    if args.continuation:
        if not args.code or not args.request_id or (not args.plan and not args.action):
            parser.error('--continuation requires --code, --request-id and --action or --plan')
        authorization_path = Path(__file__).with_name('manual-continuation-20261019.json')
        authorization = json.loads(authorization_path.read_text())
        if args.plan:
            if not args.observation or args.observation.stat().st_size > 32768:
                parser.error('--plan requires a small actual observation file (maximum 32768 bytes)')
            result = plan_continuation(authorization, args.code, args.request_id, json.loads(args.observation.read_text()))
        else:
            result = continuation_permission(authorization, args.code, args.request_id, args.action)
        print(json.dumps({**result, 'now': now.isoformat(), 'authorizationPath': str(authorization_path)}, ensure_ascii=False))
        return
    if any((args.code, args.request_id, args.action, args.plan, args.observation)):
        parser.error('Continuation options require explicit --continuation; default window is not extended')
    state_path = Path(__file__).with_suffix('.json')
    state_record = json.loads(state_path.read_text())
    start = datetime.fromisoformat(state_record['startAt'].replace('Z', '+00:00'))
    end = datetime.fromisoformat(state_record['endAtExclusive'].replace('Z', '+00:00'))
    state = 'WAITING_START' if now < start else ('EXPIRED' if now >= end else 'ACTIVE')
    print(json.dumps({'state': state, 'now': now.isoformat(), 'productionAllowed': state == 'ACTIVE' and state_record['state'] == 'SCHEDULED', 'endAtExclusive': state_record['endAtExclusive'], 'hourlyTarget': state_record['hourlyTarget'], 'automationId': state_record.get('automationId')}, ensure_ascii=False))


if __name__ == '__main__':
    main()
