#!/bin/bash

if [ $TRAVIS_BRANCH == 'introduce-docker' ] && [ "$TRAVIS_PULL_REQUEST" == 'false' ]; then
  echo "Publishing Docker Image"

  # log into docker
  docker login -u $DOCKER_USER -p $DOCKER_PASS

  # These can be paramaterized or set up via the pipeline runner
  DOCKER_ORG="bitovi"
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
