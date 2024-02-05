FROM nixos/nix:latest AS builder

COPY . /app
WORKDIR /app

RUN echo "experimental-features = nix-command flakes" >> /etc/nix/nix.conf \
  && echo "filter-syscalls = false" >> /etc/nix/nix.conf \
  && nix develop --command bun install

ENV NODE_ENV production
CMD nix develop --command bun run /app/src/index.tsx
