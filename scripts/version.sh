#!/bin/bash

COMMIT_SHA=$(git rev-parse --short HEAD)
TIMEVER=$(date -u "+%Y-%m-%d-%H%M")

export VERSION="$TIMEVER-$COMMIT_SHA"
