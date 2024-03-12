{
  description = "tavla dev env";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {

      devShells.${system}.default =
        pkgs.mkShell
          {
            buildInputs = with pkgs; [
              rustc
              cargo
              rust-analyzer
              clippy

              # Tavla
              yarn
              openjdk19
              nodejs
              nodePackages.prettier
              nodePackages.eslint
              nodePackages.typescript-language-server
            ];
          };

    };
}
