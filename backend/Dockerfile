# multi-stage docker for build and then run production specific
FROM node:13.12.0-alpine as builder

# this will be temporary working directory
WORKDIR /app/temp

# use docker caching for node_modules
COPY package*.json ./

# install only development dependences
RUN npm install --development

# copy everything for compiling the prod exec
COPY . .

# build a prod executable
RUN npm run prod-server

FROM node:13.12.0-alpine

# this will be working directory
WORKDIR /app/backend

# use docker caching 
COPY package*.json ./

# install only the production dependencies
RUN npm install --production

# only copy the prod executables in final image
COPY --from=builder /app/temp/db/ db/

EXPOSE 8081

CMD [ "npm", "run", "run-prod-server" ]
