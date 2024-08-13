{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs = [
    pkgs.tmux
    pkgs.just
    pkgs.bun
    pkgs.nodejs_20

  ];

  shellHook = ''
    echo -e "\033[90m"
    echo "Welcome to nononote.ai, $USER!"
    echo "To start, run \"just dev\""
    echo -e "\033[0m"
  '';
}
