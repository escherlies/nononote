#!/bin/bash

COMMIT_SHORT_SHA=$(git rev-parse --short HEAD)
TIMEVER=$(date -u "+%Y-%m-%d-%H%M")
LOCAL_VERSION="$TIMEVER-$COMMIT_SHORT_SHA"

# Use the version from the environment if available, otherwise use the local version
: "${VERSION:=$LOCAL_VERSION}"

echo "Version: $VERSION"
export VERSION
