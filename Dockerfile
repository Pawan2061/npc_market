# Use the official Rust image as base
FROM rust:1.77-slim-bullseye as builder

# Install required system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    pkg-config \
    libssl-dev \
    bzip2 \
    && rm -rf /var/lib/apt/lists/*

# Install Solana CLI tools
RUN mkdir -p /opt/solana && \
    curl -sSfL https://release.solana.com/v1.18.25/solana-release-x86_64-unknown-linux-gnu.tar.bz2 | \
    tar xj -C /opt/solana && \
    ln -s /opt/solana/solana-release/bin/solana /usr/local/bin/solana && \
    ln -s /opt/solana/solana-release/bin/solana-keygen /usr/local/bin/solana-keygen && \
    ln -s /opt/solana/solana-release/bin/solana-test-validator /usr/local/bin/solana-test-validator && \
    solana --version

# Install Anchor framework
RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked --force && \
    avm install latest && \
    avm use latest

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Build the program and generate IDL
RUN anchor build

# Use a smaller runtime image
FROM debian:bullseye-slim

# Install required runtime dependencies
RUN apt-get update && apt-get install -y \
    libssl-dev \
    bzip2 \
    && rm -rf /var/lib/apt/lists/*

# Copy the built artifacts from the builder stage
COPY --from=builder /app/target /app/target
COPY --from=builder /app/.anchor /app/.anchor
COPY --from=builder /opt/solana /opt/solana
COPY --from=builder /usr/local/bin/solana* /usr/local/bin/
COPY --from=builder /root/.cargo/bin/anchor /usr/local/bin/anchor

# Set environment variables
ENV PATH="/opt/solana/solana-release/bin:$PATH"

# Set working directory
WORKDIR /app

# Command to run when container starts
CMD ["anchor", "idl", "build"] 