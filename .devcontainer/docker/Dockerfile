# debianベース Node設定
FROM node:24.18-bookworm-slim

# timezone
ENV TZ=Asia/Tokyo

# apt
RUN apt-get update \
&& apt-get install -y --no-install-recommends git \
&& rm -rf /var/lib/apt/lists/*