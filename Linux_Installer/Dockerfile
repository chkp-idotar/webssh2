FROM artifactory-product.checkpoint.com/docker/node:16-alpine


WORKDIR /usr/src

COPY package.json .
COPY package-lock.json .

RUN npm ci --omit=dev

COPY . .

RUN apk update \
    && apk upgrade

EXPOSE 2222/tcp
ENTRYPOINT [ "/usr/local/bin/node", "--inspect", "index.js" ]
