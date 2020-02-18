# PMO CI

Continuous Integration has two purposes:
- [Unit Testing](#tests)
- [Publishing Artifacts](#publish)
- [Notes](#notes)


## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop)
- Image registry account (Docker Hub, etc)


## Tests

### Quick Start
```
git clone https://github.com/donejs/place-my-order.git
cd place-my-order
./docker-tests.sh
```

### Dockerfile

`Dockerfile-ci` will be used to run the tests for the UI application.

Since the UI tests need a browser, we'll need to make sure the Docker container can support a headless browser.

To do this, we'll use the following base image and install node 10:
> [markadams/chromium-xvfb](https://hub.docker.com/r/markadams/chromium-xvfb/)
> This Docker image provides a way to run a real Chromium / Chrome browser headless inside of a Docker container.


`Dockerfile-ci`
```
FROM markadams/chromium-xvfb

# Create app directory
WORKDIR /usr/src/app

# install node and such
RUN apt-get update \
    && apt-get install -y gpg build-essential libssl-dev \
    && curl -sL https://deb.nodesource.com/setup_10.x | bash - \
    && apt-get install -y nodejs gpg \
    && rm -rf /var/lib/apt/lists


# get files
COPY . .

# install dependencies
RUN npm install donejs -g
RUN npm install

# run the tests
RUN npm run test-chrome
```

### Script
We'll add a script to run the tests via Docker

```
touch docker-tests.sh
chmod +x docker-tests.sh
```
`docker-tests.sh`
```
#!/bin/bash
docker-compose -f docker-compose.test.yml build
```


### References
- https://www.digitalocean.com/community/tutorials/how-to-configure-a-continuous-integration-testing-environment-with-docker-and-docker-compose-on-ubuntu-14-04
- https://hub.docker.com/r/markadams/chromium-xvfb-js/


## Publish

To publish the image, you'll need an account with an image registry.

For this example, we'll use Docker Hub.


Then, you'll need a script to do the publishing and a pipeline runner that can run Docker containers like Travis, CircleCI, Gitlab, etc.

For this example, we'll use Travis with a `.travis.yml`.

### Script
Add a script to publish to Docker Hub

```
touch docker-publish.sh
chmod +x docker-publish.sh
```
`docker-publish.sh`
```
#!/bin/bash

if [ $TRAVIS_BRANCH == 'introduce-docker' ] && [ "$TRAVIS_PULL_REQUEST" == 'false' ]; then
  echo "Publishing Docker Image"

  # log into docker
  docker login -u $DOCKER_USER -p $DOCKER_PASS

  # These can be paramaterized or set up via the pipeline runner
  DOCKER_ORG="mickmcgrath13"
  DOCKER_REPO="place-my-order"
  DOCKER_PATH="$DOCKER_ORG/$DOCKER_REPO"
  DOCKER_TAG="latest"

  echo "Building the container with the: $DOCKER_PATH:$DOCKER_TAG"

  # Build Docker Container
  docker build -t "$DOCKER_PATH:$DOCKER_TAG" .
  docker push $DOCKER_PATH
else
  echo "Skipping: Publishing Docker Image"
fi
```

> **Note:** You'll need to add `DOCKER_USER` and `DOCKER_PASS` to the travis build via "More Options" -> "Settings"

> **Tip:** Use a token from Docker Hub instead of your password

### .travis.yml
Add a file called `.travis.yml` with the following contents

```
jobs:
  include:
    - stage: "Test"
      name: "Unit Tests"
      script: ./docker-tests.sh
    - stage: "Publish"
      name: "Publish Docker"
      script: ./docker-publish.sh
services:
  - docker
```


## Notes

### Github Actions and Packages
Try it out!

### DockerHub / GitHub Connections

It's possible to connect DockerHub to GitHub such that pushes to GitHub will trigger builds in DockerHub.

[More Info](https://docs.docker.com/docker-hub/builds/)

A couple of benefits of the above approach:
- It's fairly portable to any registry
- You can ensure that tests pass before images are published

