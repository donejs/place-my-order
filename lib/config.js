import path from 'path';

const config = {
  mongodb: 'mongodb://localhost:27017/place-my-order',
  port: 3030,
  system: {
    config: path.join(__dirname, "..", "/public/package.json!npm"),
    main: "app/main.stache!",
  }
};

if(process.env.NODE_ENV === 'production') {
  config.port = process.env.PORT;
  config.mongodb = '';
}

export default config;
