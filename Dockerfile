FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    imagemagick \
    libheif-dev \
    libde265-0 \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 4000

CMD ["npm", "start"]
