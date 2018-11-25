#!/usr/bin/env bash

CWD=$(dirname $(which $0))
ERR=0

for f in $(find ${CWD}/unit/util -maxdepth 1 -name *.test.js)
do
  node ${f}
  ERR=$((ERR + $?))
done

for f in $(find ${CWD}/unit -maxdepth 1 -name *.test.js)
do
  node ${f}
  ERR=$((ERR + $?))
done

for f in $(find ${CWD}/join -maxdepth 1 -name *.test.js)
do
  node ${f}
  ERR=$((ERR + $?))
done

echo ""
echo "Mocha samples"
echo ""

for f in $(find ${CWD}/mocha-samples -maxdepth 1 -name *.test.js)
do
  node ${f} --silent
  ERR=$((ERR + $?))
done

exit ${ERR}
