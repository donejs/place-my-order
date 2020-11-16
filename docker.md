# PMO Docker

Wrapping PMO in Docker with docker-compose

Sections:
- [Benefits](#benefits)
- [Prerequisites](#prerequisites)
- [Dockerfiles](#dockerfiles)
- [Building Docker](#building-docker)
- [Running the app](#running-the-app)
- [Developing the app](#developing-the-app)
- [References](#references)

## Benefits

### Environment Parity
If you're using microservices deployed with a container orchestrator like Kubernetes, docker-compose is a great way of locally emulating the communiction between microservices.

### No host dependencies
No need to install various dependencies on your host machine (node, databases, etc).

In fact, maintaining the mindset of "I don't have anything on my machine except for a text editor and docker", it'll be very helpful in ensuring that your microservices are easily deployable.

### Onboarding
New developers can get started more easily than following a set of steps to get their local environment set up.  It should be as simple as:
```
git clone https://github.com/donejs/place-my-order.git
cd place-my-order
docker-compose up
```
Visit http://localhost:8080



## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop)


## Quick Start
```
git clone https://github.com/donejs/place-my-order.git
cd place-my-order
docker-compose up
```
Visit http://localhost:8080

## Dockerfiles

We'll specify 2 `Dockerfile`s:

- `Dockerfile` - UI
- `Dockerfile-api` - API

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

## Building Docker

Build both the api (`Dockerfile-api`) and the ui (`Dockerfile`) containers:
```
docker-compose build
```

## Running the app

```
docker-compose up
```

> **Note:** You can also rebuild the app prior to running via `docker-compose up --build`

## Stopping the app

```
docker-compose down
```

## Developing the app

### Mounting the repo into the container
The repo files are bound from the host to the container with volumes.
The `volumes` section of the `place-my-order` service in `docker-compose.yml`:
```
services:
  place-my-order:
    volumes:
      - .:/usr/src/app
      - /usr/src/app/node_modules
```

- `.:/usr/src/app` shares the current working directory on the host (where `docker-compose` is executed) to `/usr/src/app` in the container.
    - `/usr/src/app` is defined in the Dockerfile via the `WORKDIR` directive
- `/usr/src/app/node_modules` - This will mount the node_modules directory to the host machine using the buildtime directory.
    - [More info](https://jdlm.info/articles/2016/03/06/lessons-building-node-app-docker.html#the-node_modules-volume-trick)

With this approach, the following will be true:
- `node_modules` will be available within the container
- Changes to app code will be reflected within the running container

### Running scripts

Sometimes it's necessary to execute scripts against the running services.
This can be achieved using `docker-compose run <service-name> <script>`.

For example, say a new dependency is required for the `place-my-order` defined in `docker-compose.yml`.  It can be added like this:
```
docker-compose run place-my-order npm install jsdoc --save
```


## References
- https://blog.codeship.com/using-docker-compose-for-nodejs-development/
- https://jdlm.info/articles/2016/03/06/lessons-building-node-app-docker.html#the-node_modules-volume-trick
- https://stackoverflow.com/questions/30043872/docker-compose-node-modules-not-present-in-a-volume-after-npm-install-succeeds
