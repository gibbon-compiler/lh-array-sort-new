#!/usr/bin/env python3
"""Assert that a benchmark's runtime actually grows with input size.

GHC 9.10.1 with -O2 proved able to delete the in-place writes in
Array.Mutable.PrimUnlifted (set# returns the same array it was given, so the
write looks dead), which made insertionsort report ~2us at n=1000 and scale
linearly instead of quadratically. The numbers looked great and meant nothing.

Given criterion --csv output for the same algorithm at two sizes, this compares
the 'ours' row and fails if the measured ratio is far below what the algorithm's
complexity demands.

    check_scaling.py --min-ratio 10 small.csv large.csv
"""
import argparse
import csv
import sys


def ours_mean(path):
    with open(path, newline="") as handle:
        rows = [r for r in csv.DictReader(handle) if r["Name"].endswith("/ours")]
    if len(rows) != 1:
        raise SystemExit(
            "expected exactly one '.../ours' row in %s, found %d" % (path, len(rows))
        )
    return rows[0]["Name"], float(rows[0]["Mean"])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--min-ratio", type=float, required=True)
    parser.add_argument("small_csv")
    parser.add_argument("large_csv")
    args = parser.parse_args()

    small_name, small = ours_mean(args.small_csv)
    large_name, large = ours_mean(args.large_csv)
    if small <= 0:
        raise SystemExit("non-positive mean for %s" % small_name)

    ratio = large / small
    print("%s = %.2f us" % (small_name, small * 1e6))
    print("%s = %.2f us" % (large_name, large * 1e6))
    print("ratio = %.1fx (require >= %.1fx)" % (ratio, args.min_ratio))

    if ratio < args.min_ratio:
        print(
            "\nFAIL: runtime is not growing with input size. The sort is most "
            "likely being optimised away rather than measured -- every number "
            "this run produced is meaningless. See the module docstring.",
            file=sys.stderr,
        )
        return 1
    print("OK: runtime scales with input size.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
