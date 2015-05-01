const config = {
  mongodb: 'mongodb://localhost:27017/place-my-order',
  port: 3030
};

if(process.env.NODE_ENV === 'production') {
  config.port = process.env.PORT;
  config.mongodb = '';
}

export default config;