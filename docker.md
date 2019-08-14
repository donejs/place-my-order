# PMO Docker

Wrapping PMO in Docker.

Sections:
- [Prerequisites](#prerequisites)
- [Dockerfiles](#dockerfiles)
- [Building Docker](#building-docker)
- [Running the app](#running-the-app)

## Prerequisites

- Docker

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
CMD [ "donejs", "develop-docker" ]
# If you are running production, use
# ENV NODE_ENV production
# CMD [ "npm", "start" ]
```

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

## Stopping the app

Stop both the api (`Dockerfile-api`) and the ui (`Dockerfile`) containers:
```
./scripts-docker/stop
```
