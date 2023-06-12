# multi-stage docker for build and then run production specific
FROM node:13.12.0-alpine as builder

# this will be temporary working directory
WORKDIR /app/frontend

# use docker caching for node_modules
COPY package*.json ./

# install all dependences
RUN npm install

COPY . .

# build a development executable
RUN npm run build-dev

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

# final stage
FROM nginx:alpine

COPY ./nginx.dev.conf /etc/nginx/conf.d/default.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# copy all the compiled production code to nginx html file from react
COPY --from=builder /app/frontend/dist /usr/share/nginx/html/dist
COPY --from=builder /app/frontend/node_modules /usr/share/nginx/html/node_modules

EXPOSE 80 443

ENTRYPOINT ["nginx", "-g", "daemon off;"]
