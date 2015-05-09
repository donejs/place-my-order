import path from 'path';

const config = {
  mongodb: 'mongodb://localhost:27017/place-my-order',
  delay: 1000,
  port: 3030,
  system: {
    config: path.join(__dirname, "..", "/public/package.json!npm"),
    main: "app/main.stache!"
  }
};

export default config;
