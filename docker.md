# PMO Docker

Wrapping PMO in Docker.

Sections:
- [Prerequisites](#prerequisites)
- [Dockerfiles](#dockerfiles)
- [Building Docker](#building-docker)
- [Running the app](#running-the-app)

## Prerequisites

- Docker

> **Note:** This guide so far assumes running on a Mac due to Docker cross-container communication.
> Non-Mac executions will be covered in a future guide.

## Dockerfiles

We'll specify 3 `Dockerfile`s:

- `Dockerfile` - UI
- `Dockerfile-api` - API
- `Dockerfile-ci` - CI (tests, etc)

### Dockerfile

The main dockerfile will be used to run the UI application.

`Dockerfile`
```
FROM node:10.0

# Create app directory
WORKDIR /usr/src/app

# get files
COPY . .

# install dependencies
RUN npm install donejs -g
RUN npm install

# If you are building your code for production
# RUN donejs build

# expose your ports
EXPOSE 8080

# start it up
CMD [ "donejs", "develop-docker-mac" ]
# If you are running production, use
# ENV NODE_ENV production
# CMD [ "npm", "start" ]
```

> **Note:** Notice the `develop-docker-mac` instead of `develop`.  This is because the UI container needs to know how to communicate with the API container.
> With a Mac, there is a `http://docker.for.mac.localhost` which allows access to another container.  See `scripts["develop-docker-mac"]` in `package.json` for more details.

### Dockerfile-api

This dockerfile will be used to run the API for the application.

`Dockerfile-api`
```
FROM node:10.0

# Create app directory
WORKDIR /usr/src/app

# get files
COPY . .

# install dependencies
RUN npm install donejs -g
RUN npm install

# expose your ports
EXPOSE 7070

# start it up
CMD [ "donejs", "api" ]
```

### Dockerfile-ci

This dockerfile will run CI things (tests, build & tag, etc).

Only tests implemented currently:

```
FROM node:10.0

# Create app directory
WORKDIR /usr/src/app

# get files
COPY . .

# install dependencies
RUN npm install donejs -g
RUN npm install

# run the tests
RUN donejs test
```

## Building Docker

Build both the api (`Dockerfile-api`) and the ui (`Dockerfile`) containers:
```
./scripts-docker/build
```

## Running the app

Run both the api (`Dockerfile-api`) and the ui (`Dockerfile`) containers:
```
./scripts-docker/run
```
