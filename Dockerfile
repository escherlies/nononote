FROM ghcr.io/escherlies/nixnode/nixnode:latest

USER root

# Install bun
RUN nix-env -i bun

# Copy scripts and shared files
COPY ./scripts /app/scripts
COPY ./shared /app/shared

# Serevr app

WORKDIR /app/server

COPY ./server .

RUN just install

RUN just build

# Client app

WORKDIR /app/client

COPY ./client .

RUN npm ci

RUN just build

# Set workdir
WORKDIR /app/server

# Run
CMD ["just", "run"]
