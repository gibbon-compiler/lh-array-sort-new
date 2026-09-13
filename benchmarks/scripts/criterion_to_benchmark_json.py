#!/usr/bin/env python3
"""Convert criterion --csv output into github-action-benchmark's
customSmallerIsBetter JSON format.

github-action-benchmark ships no parser for Haskell criterion (see its
action.yml: cargo, go, benchmarkjs, pytest, googlecpp, catch2, julia,
benchmarkdotnet, customBiggerIsBetter, customSmallerIsBetter), so we emit the
generic format instead.

bench-criterion takes one --size/--algo pair per invocation, so a full sweep
produces several CSV files; they are merged here.

Criterion writes seconds; we emit nanoseconds so charts avoid tiny floats.

    criterion_to_benchmark_json.py -o results.json run1.csv run2.csv ...
"""

import argparse
import csv
import json

SECONDS_TO_NANOSECONDS = 1e9


def convert(csv_paths):
    entries = []
    seen = {}
    for path in csv_paths:
        with open(path, newline="") as handle:
            for row in csv.DictReader(handle):
                name = row["Name"]
                if name in seen:
                    raise SystemExit(
                        "duplicate benchmark %r in %s and %s" % (name, seen[name], path)
                    )
                seen[name] = path
                entries.append(
                    {
                        "name": name,
                        "unit": "ns",
                        "value": float(row["Mean"]) * SECONDS_TO_NANOSECONDS,
                        "range": "± %.1f"
                        % (float(row["Stddev"]) * SECONDS_TO_NANOSECONDS),
                    }
                )
    if not entries:
        raise SystemExit("no benchmark rows found in: %s" % ", ".join(csv_paths))
    return entries


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("-o", "--output", required=True)
    parser.add_argument("csv_files", nargs="+")
    args = parser.parse_args()

    entries = convert(args.csv_files)
    with open(args.output, "w") as handle:
        json.dump(entries, handle, indent=2, ensure_ascii=False)
        handle.write("\n")
    print("wrote %d benchmarks to %s" % (len(entries), args.output))


if __name__ == "__main__":
    main()
