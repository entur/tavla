#!/bin/bash

FONT_FOLDER="node_modules/@entur/fonts"
FONT_INDEX_FILE="$FONT_FOLDER/index.css"

if [ ! -f $FONT_INDEX_FILE ]; then
    mkdir -p $FONT_FOLDER
    touch $FONT_INDEX_FILE
fi
