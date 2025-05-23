# 1. Use Debian-based Node so you get glibc (not Alpine’s musl)
FROM node:18-slim

# 2. Set working dir
WORKDIR /usr/src/app

# 3. Copy only the package manifests
COPY package*.json ./

# 4. Install build tools and then your deps
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 build-essential \
 && npm ci --omit=dev \
 && rm -rf /var/lib/apt/lists/*

# 5. Copy the rest of your app (host node_modules is ignored)
COPY . .

# 6. Expose and launch
EXPOSE 3000
CMD ["node", "server.js"]
