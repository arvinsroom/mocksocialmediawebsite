# multi-stage docker for build and then run production specific
FROM node:13.12.0-alpine as builder

# this will be temporary working directory
WORKDIR /app/temp

# use docker caching for node_modules
COPY package*.json ./

# install only development dependences
RUN npm install --development

COPY . .

# build a prod executable
RUN npm run prod-server


FROM node:13.12.0-alpine

# this will current working directory
WORKDIR /app/frontend

COPY package*.json ./

# install only the production dependencies
RUN npm install --production

# only copy the prod executables in final image
COPY --from=builder /app/temp/dist/ dist/

EXPOSE 8080

CMD [ "npm", "run", "run-prod-server" ]
