#!/usr/bin/env bash

CMD=$(dirname $(which $0))
ERR=0

for f in $(find ${CMD}/lib/util -maxdepth 1 -name *.test.js)
do
  node ${f}
  ERR=$((ERR + $?))
done

for f in $(find ${CMD}/lib -maxdepth 1 -name *.test.js)
do
  node ${f}
  ERR=$((ERR + $?))
done

echo ""
echo "Mocha samples"
echo ""

for f in $(find ${CMD}/mocha-samples -maxdepth 1 -name *.test.js)
do
  node ${f} --silent
  ERR=$((ERR + $?))
done

exit ${ERR}
