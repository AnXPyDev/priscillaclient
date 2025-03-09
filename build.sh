#!/bin/sh

npm run build:win
[ $? = 0 ] || exit 1

cd vanguard
./build.sh
cd -

cd updateservice
./build.sh
cd -
