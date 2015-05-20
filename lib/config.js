import path from 'path';

const config = {
  mongodb: process.env.MONGODB || 'mongodb://localhost:27017/place-my-order',
  delay: 0,
  port: process.env.PORT || 3030
};

export default config;
