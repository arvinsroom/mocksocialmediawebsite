# multi-stage docker for build and then run production specific
FROM node:13.12.0-alpine as builder

# this will be temporary working directory
WORKDIR /app/temp

# use docker caching for node_modules
COPY package*.json ./

# install all dependencies
RUN npm install

# copy everything for compiling the prod exec
COPY . .

# build a development executable
RUN npm run build-prod

# delete dev dependencies
RUN npm prune --production

# install node-prune globally
RUN npm install -g node-prune

# install bash shell in docker
RUN apk update && apk add bash

# run node prune script, remove all unused or required files from node_modules
RUN /usr/local/bin/node-prune

# remove more unused dependencies
RUN rm -rf node_modules/rxjs/src/
RUN rm -rf node_modules/rxjs/bundles/
RUN rm -rf node_modules/rxjs/_esm5/
RUN rm -rf node_modules/rxjs/_esm2015/
RUN rm -rf node_modules/swagger-ui-dist/*.map

FROM node:13.12.0-alpine

# this will be working directory
WORKDIR /app/backend

# copy all the compiled production code
COPY --from=builder /app/temp/db db
COPY --from=builder /app/temp/node_modules node_modules

# global install pm2
RUN npm install pm2 -g

EXPOSE 8081

# manage service down in production
CMD [ "pm2-runtime", "./db/index.js" ]