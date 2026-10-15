window.BENCHMARK_DATA = {
  "lastUpdate": 1792107281173,
  "repoUrl": "https://github.com/gibbon-compiler/lh-array-sort-new",
  "entries": {
    "lh-array-sort": [
      {
        "commit": {
          "author": {
            "email": "a.pelenitsyn@gmail.com",
            "name": "Artem Pelenitsyn",
            "username": "ulysses4ever"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "2cfddeb336a769a562ee8a3f78e7067e8072618c",
          "message": "Benchmark regression tracking on criterion + GHC 9.10.3 container (#41)\n\n* add a criterion-based benchrunner pipeline\n\nThe full pipeline is documented in README but, in a nutshell,:\n\n[criterion-based Haskell core `benchrunner:exe:bench-criterion`] ->\n[python scripts to sweep over array sizes for sequential or over core counts for parallel] ->\n[python scripts to plot]\n\n- sequential algos: insertion, quick, merge\n\n- parallel scaling: mergesort\n\n- rename benchrunner exec to benchrunner-old to avoid cabal confusions around `cabal run benchrunner`\n\n* add criterion benchmark regression tracking\n\nRuns the criterion suite on the self-hosted runner and publishes results to\ngh-pages via github-action-benchmark, so every run gets a comparison comment\nand the history is visible as a chart. Alerts at a 20% slowdown but never\nfails the build.\n\nAlso moves the CI container to GHC 9.10.3. Under 9.10.1 with -O2, GHC deleted\nthe in-place writes in Array.Mutable.PrimUnlifted -- set# returns the array it\nwas given, so the write looks dead -- and insertionsort \"ran\" in 2.3us at\nn=1000, scaling linearly instead of quadratically. 9.10.3 measures it honestly\nat 117us with the expected 100x growth over a 10x size increase.\n\nTwo guards keep that from silently coming back: the benchmarks demand an\nelement of the sorted array rather than just its constructor, and\ncheck_scaling.py fails CI if insertionsort stops growing quadratically.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>\n\n* run benchmark steps under bash\n\nThe runner selects busybox sh for this Alpine container despite bash being\npresent. Under sh, \"${@:3}\" is not an array slice but a single empty string,\nwhich criterion reads as a benchmark name filter and matches nothing, so the\nfirst benchmark invocation died with exit 64.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>\n\n* mark the workspace as safe for git in the benchmark container\n\nThe workspace is checked out under the runner's uid but git runs as root\ninside the container, so github-action-benchmark's fetch of gh-pages aborts\nwith \"detected dubious ownership\" before it can compare or comment.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>\n\n* benchmark every algorithm at two sizes\n\nQuicksort and MergesortPar each ran at a single size, so a move in their\nnumbers could not be told apart from a change in how the runtime scales.\nInsertionsort and Mergesort already had a pair; this gives the other two the\nsame, and matches MergesortPar's sizes to Mergesort's so the two read as a\nparallel-speedup comparison at equal n.\n\nThe benchmark step is 52s and each size costs about 10s, so the coverage is\nclose to free.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>\n\n* drop the obsolete liquidhaskell:bytestring allow-newer\n\nThe comment claimed this pin made the 9.10.1 -> 9.10.3 bump impossible. It\nno longer does: LH 0.9.10.1 verifies every module SAFE on GHC 9.10.3 with\nthe stanza gone.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>\n\n* run every workflow on the same 9.10.3 image\n\nbenchmark.yaml already pinned :9.10.3 while the other five jobs took\nwhatever :latest happened to be, so a benchmark number and a test result\ncould come from different compilers. Pin by tag rather than re-push\n:latest, which other checkouts consume implicitly.\n\nEach backend was run inside the image first: liquid verifies all 25\nmodules SAFE, pure-arrays 34/34, mutable-arrays 27/27, and benchrunner-old\nbuilds and runs.\n\nThe Dockerfile gains a pure-arrays pass under its own --builddir so a\nbreak there fails the image build instead of every job downstream. It\ncaches nothing at CI time -- dist-* is bound to the source path and CI\nchecks out elsewhere -- it is only a gate.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>\n\n* drop the pure-arrays pass from the image build\n\nAdded it on the mistaken premise that the image gates correctness. It does\nnot -- it exists to warm the dependency store, and the existing cabal test\nis there to pull test-suite deps in, not to check anything. Every\nbuild-depends in lh-array-sort.cabal is unconditional, so the pure-arrays\nflags resolve to the same closure as prim-mutable-arrays and the extra pass\nstored nothing. Builddirs are discarded with the checkout anyway.\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>\n\n---------\n\nCo-authored-by: Claude Opus 4.7 <noreply@anthropic.com>",
          "timestamp": "2026-10-15T19:33:03-04:00",
          "tree_id": "1a30d90483ddaa3fa2521680f46d51cf6159e812",
          "url": "https://github.com/gibbon-compiler/lh-array-sort-new/commit/2cfddeb336a769a562ee8a3f78e7067e8072618c"
        },
        "date": 1792107280944,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "insertionsort/1000/ours",
            "value": 100015.4815746097,
            "range": "± 67.9",
            "unit": "ns"
          },
          {
            "name": "insertionsort/1000/vector",
            "value": 141833.90580039253,
            "range": "± 65.4",
            "unit": "ns"
          },
          {
            "name": "insertionsort/1000/c",
            "value": 517966.4337675722,
            "range": "± 343.9",
            "unit": "ns"
          },
          {
            "name": "insertionsort/10000/ours",
            "value": 8952391.865556622,
            "range": "± 9964.7",
            "unit": "ns"
          },
          {
            "name": "insertionsort/10000/vector",
            "value": 8988440.525793634,
            "range": "± 6846.0",
            "unit": "ns"
          },
          {
            "name": "insertionsort/10000/c",
            "value": 49760708.85114106,
            "range": "± 233563.6",
            "unit": "ns"
          },
          {
            "name": "mergesort/100000/ours",
            "value": 12448878.165413344,
            "range": "± 66936.9",
            "unit": "ns"
          },
          {
            "name": "mergesort/100000/vector",
            "value": 3834587.5906018987,
            "range": "± 18674.2",
            "unit": "ns"
          },
          {
            "name": "mergesort/100000/c",
            "value": 10169098.627029905,
            "range": "± 13324.4",
            "unit": "ns"
          },
          {
            "name": "mergesort/1000000/ours",
            "value": 127507213.77734509,
            "range": "± 1470733.1",
            "unit": "ns"
          },
          {
            "name": "mergesort/1000000/vector",
            "value": 41325662.741592415,
            "range": "± 224746.0",
            "unit": "ns"
          },
          {
            "name": "mergesort/1000000/c",
            "value": 111371223.02316128,
            "range": "± 61855.9",
            "unit": "ns"
          },
          {
            "name": "mergesort-par/100000/ours-par",
            "value": 4640544.726033212,
            "range": "± 245141.5",
            "unit": "ns"
          },
          {
            "name": "mergesort-par/1000000/ours-par",
            "value": 46994484.21608568,
            "range": "± 546225.8",
            "unit": "ns"
          },
          {
            "name": "quicksort/100000/ours",
            "value": 4576109.212852255,
            "range": "± 26594.3",
            "unit": "ns"
          },
          {
            "name": "quicksort/100000/vector",
            "value": 3565597.4783177376,
            "range": "± 6910.1",
            "unit": "ns"
          },
          {
            "name": "quicksort/100000/c",
            "value": 4036237.937442307,
            "range": "± 29306.0",
            "unit": "ns"
          },
          {
            "name": "quicksort/1000000/ours",
            "value": 179877146.2791289,
            "range": "± 11684870.4",
            "unit": "ns"
          },
          {
            "name": "quicksort/1000000/vector",
            "value": 35636795.818162695,
            "range": "± 73315.2",
            "unit": "ns"
          },
          {
            "name": "quicksort/1000000/c",
            "value": 40356591.32234676,
            "range": "± 228980.8",
            "unit": "ns"
          }
        ]
      }
    ]
  }
}