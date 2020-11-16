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
