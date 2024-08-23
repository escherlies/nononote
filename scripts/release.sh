#!/bin/bash
DIR=$(realpath $(dirname "$0"))

# Tag
. $DIR/version.sh
git tag "v$VERSION"
git push origin "v$VERSION"
