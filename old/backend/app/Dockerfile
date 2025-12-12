FROM denoland/deno:latest

WORKDIR /app

# Copy dependency configuration
COPY deno.json deno.lock* ./

# Copy source code
COPY . .

# Cache dependencies
RUN deno cache server.ts

EXPOSE 8080

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD deno eval "fetch('http://localhost:8080/health').then(r => r.ok ? Deno.exit(0) : Deno.exit(1))"

CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "--allow-sys", "--unstable-node-globals", "server.ts"]