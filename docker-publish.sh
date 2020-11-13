#!/bin/bash

if [ $TRAVIS_BRANCH == 'introduce-docker' ] && [ "$TRAVIS_PULL_REQUEST" == 'false' ]; then
  echo "Publishing Docker Image"

  # log into docker
  docker login ghcr.io -u $DOCKER_USER -p $GITHUB_PERSONAL_ACCESS_TOKEN
  # These can be paramaterized or set up via the pipeline runner
  DOCKER_HOST="ghcr.io"
  DOCKER_ORG="donejs"
  DOCKER_REPO="place-my-order"
  DOCKER_PATH="$DOCKER_HOST/$DOCKER_ORG/$DOCKER_REPO"
  DOCKER_TAG="$TRAVIS_COMMIT"

  echo "Building the container with the: $DOCKER_PATH:$DOCKER_TAG"

  # Build Docker Container
  docker build -t "$DOCKER_PATH" -t "$DOCKER_PATH:$DOCKER_TAG" -f Dockerfile-prod .
  docker push $DOCKER_PATH
else
  echo "Skipping: Publishing Docker Image"
fi