#!/usr/bin/env python3
"""Offline whole-song quota proposal; no generation, publication or ledger writes."""
import argparse
import json
from pathlib import Path


def read_policy(path):
    policy = json.loads(path.read_text())
    styles = policy["styles"]
    ids = [style["id"] for style in styles]
    if not styles or len(set(ids)) != len(ids):
        raise ValueError("Genre IDs must be unique and nonempty.")
    weights = [style["basisPoints"] for style in styles]
    if any(type(w) is not int or w <= 0 for w in weights):
        raise ValueError("Weights must be positive integer basis points.")
    if policy["basisPointTotal"] != 10000 or sum(weights) != 10000:
        raise ValueError("Genre shares must total 100%.")
    return policy


def plan(policy, number, counts):
    if type(number) is not int or number < 1:
        raise ValueError("The requested song count must be a positive integer.")
    styles = policy["styles"]
    ids = [s["id"] for s in styles]
    if not isinstance(counts, dict) or set(counts) - set(ids):
        raise ValueError("Counts contain an unknown genre or are not a mapping.")
    used = {i: counts.get(i, 0) for i in ids}
    if any(type(n) is not int or n < 0 for n in used.values()):
        raise ValueError("Existing counts must be nonnegative integers.")
    total = sum(used.values()) + number
    allocation = dict.fromkeys(ids, 0)
    for _ in range(number):
        chosen = max(styles, key=lambda s: s["basisPoints"] * total
                     - 10000 * (used[s["id"]] + allocation[s["id"]]))["id"]
        allocation[chosen] += 1
    return {
        "seriesSongsBefore": sum(used.values()),
        "newSongs": number,
        "quotas": allocation,
        "seriesCountsAfter": {i: used[i] + allocation[i] for i in ids},
        "targetPercentages": {s["id"]: s["basisPoints"] / 100 for s in styles},
        "note": "A quota proposal, not subject assignments or achieved percentages. Match stories to suitable slots; short batches round and later batches carry deficits.",
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("number", type=int)
    parser.add_argument("--counts", type=Path, help="Accepted active-series counts JSON")
    parser.add_argument("--policy", type=Path,
                        default=Path(__file__).resolve().parents[1] / "references" / "genre-policy.json")
    args = parser.parse_args()
    try:
        policy = read_policy(args.policy)
        counts = json.loads(args.counts.read_text()) if args.counts else {}
        output = plan(policy, args.number, counts)
    except (ValueError, KeyError, OSError) as error:
        parser.error(str(error))
    print(json.dumps(output, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
