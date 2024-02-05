{
  description = "kindash";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShell = with pkgs; mkShell {
        buildInputs = [
          bun
          ungoogled-chromium
        ];

        shellHook = ''
          export CHROME_BIN=${pkgs.ungoogled-chromium}/bin/chromium
          echo "bun: v`${pkgs.bun}/bin/bun --version`"
          echo "`${pkgs.ungoogled-chromium}/bin/chromium --version`"
        '';
      };
    });
}
