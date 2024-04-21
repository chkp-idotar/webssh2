FROM artifactory-product.checkpoint.com/docker/node:16-alpine


WORKDIR /usr/src

COPY app/package.json .
COPY app/package-lock.json .

RUN npm ci --omit=dev

COPY app/ /usr/src/

RUN apk update \
    && apk upgrade

EXPOSE 2222/tcp
ENTRYPOINT [ "/usr/local/bin/node", "--inspect", "index.js" ]
