#!/bin/sh

COMPRESSION="-m0=LZMA -mx=5"

rm latest.zip
rm -rf tmp_archive

mkdir tmp_archive

cp -r dist/win-unpacked/* tmp_archive/
cp -r metadata/* tmp_archive/
cp -r updateservice/update.exe tmp_archive/
cp -r vanguard/vanguard.exe tmp_archive/


cd tmp_archive
7z a -r $COMPRESSION ../latest.zip *

