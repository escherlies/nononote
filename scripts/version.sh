#!/bin/bash

# Use COMMIT_SHORT_SHA from ci/cd environment if available, otherwise use git to get the short sha
: "${COMMIT_SHORT_SHA:=$(git rev-parse --short HEAD)}"
TIMEVER=$(date -u "+%Y-%m-%d-%H%M")

export VERSION="$TIMEVER-$COMMIT_SHORT_SHA"
