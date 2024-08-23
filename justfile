install:
  cd client && npm install
  cd server && bun install

dev:
  nix-shell --run ". ./dev.sh"

shell:
  nix-shell --run fish

close:
  tmux kill-session -t dev

release:
  bash ./scripts/release.sh