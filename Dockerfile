FROM node:20-bookworm-slim

# Set environment variables
ENV NODE_ENV=production
ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-setuptools \
    ffmpeg \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create symlinks for python
RUN ln -sf /usr/bin/python3 /usr/bin/python

# Install yt-dlp via pip (most stable for linux environments)
RUN pip3 install --no-cache-dir --break-system-packages yt-dlp

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json ./
# We skip generating a lockfile locally if it's failing due to system path issues, 
# Render will handle it if we provide a clean package.json

# Install dependencies
# We use --prefer-offline and --no-audit to speed up and reduce memory usage on Render free tier
RUN npm install --production --no-audit --no-fund --prefer-offline

# Copy the rest of the application
COPY . .

# Ensure app has permissions
RUN chown -R node:node /app
USER node

EXPOSE 3000

CMD ["node", "src/server.js"]
