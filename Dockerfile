FROM node:16-alpine


WORKDIR /usr/src
COPY app/ /usr/src/

# RUN apk update --no-cache --allow-untrusted --repository https://artifactory-product.checkpoint.com/artifactory/alpine/v3.18/main && apk upgrade --no-cache --allow-untrusted --repository https://artifactory-product.checkpoint.com/artifactory/alpine/v3.18/main 
RUN apk add git --no-cache --allow-untrusted --repository https://artifactory-product.checkpoint.com/artifactory/alpine/v3.18/main && npm config set registry https://artifactory-product.checkpoint.com/artifactory/api/npm/npm/
RUN npm install && npm prune --production

EXPOSE 2222/tcp
ENTRYPOINT [ "/usr/local/bin/node", "--inspect", "index.js" ]
