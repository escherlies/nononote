FROM ghcr.io/escherlies/nixnode/nixnode:latest

USER root

# Install dependencies

# Install bun
RUN nix-env -i bun

# Install client dependencies
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci

# Build client
COPY client/ ./
RUN npm run build

# Install server dependencies
WORKDIR /app/server/
COPY server/package*.json ./
RUN just install

# Build server
COPY server/ ./
RUN just build

# Run
CMD ["just", "run"]
