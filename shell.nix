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
    echo "Willkommen du Lauch, $USER!"
    echo "Lauch is a german word for leek, a vegetable."
    echo "It is also a slang word for a person who is lean."
    echo "In software development, lean is a good thing."
    echo "So, be a Lauch!"
    echo -e "\033[0m"
  '';
}
