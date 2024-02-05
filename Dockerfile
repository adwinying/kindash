FROM nixos/nix:latest AS builder

WORKDIR /app
COPY flake.nix /app
COPY flake.lock /app
COPY ./package.json /app
COPY ./bun.lockb /app

RUN echo "experimental-features = nix-command flakes" >> /etc/nix/nix.conf \
  && echo "filter-syscalls = false" >> /etc/nix/nix.conf \
  && nix develop --command bun install

COPY . /app
ENV NODE_ENV production
CMD nix develop --command bun run /app/src/index.tsx
