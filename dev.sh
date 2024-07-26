#!/bin/bash

# Start a new tmux session
tmux new-session -d -s dev

# Split the window into multiple panes
tmux split-window -v
tmux select-pane -t 0

# Run different commands in each pane
echo "Starting server..."
tmux send-keys -t 0 'cd server && just dev' C-m

echo "Starting client..."
tmux send-keys -t 1 'cd client && just dev' C-m

# Attach to the tmux session
tmux attach-session -t dev
