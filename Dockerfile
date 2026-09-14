FROM benz0li/ghc-musl:9.10.3

RUN apk upgrade --no-cache \
 && apk add --no-cache \
      z3 git python3

RUN  mkdir cabal-dir \
  && export CABAL_DIR=/cabal-dir \
  && cabal update \
  `# hackage's TUF mirror list includes objects-us-east-1.dream.io, which 403s on` \
  `# every package; dropping it pins downloads to the primary and keeps builds reproducible` \
  && rm -f /cabal-dir/packages/hackage.haskell.org/mirrors.json \
  && git clone https://github.com/gibbon-compiler/lh-array-sort-new.git app \
  && cd app      \
  && cabal configure --constraint="lh-array-sort -liquid-checks +prim-mutable-arrays" --enable-tests \
  && cabal build all \
  && cabal test      \
  `# the pure-arrays backend gets its own pass so a break there fails the image` \
  `# build rather than every CI job downstream of it; separate --builddir keeps` \
  `# it from clobbering the prim-mutable-arrays artifacts above` \
  && cabal configure --constraint="lh-array-sort -liquid-checks" --enable-tests --builddir=dist-pure \
  && cabal build lh-array-sort --builddir=dist-pure \
  && cabal test --builddir=dist-pure \
  && cd ..       \
  && rm -rf /app

CMD ["bash"]
