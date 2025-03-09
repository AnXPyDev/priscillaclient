#!/bin/sh

pyinstaller \
	--exclude-module pandas\
	--exclude-module numpy\
	--onefile --name update --distpath ./ main.py
