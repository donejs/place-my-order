import path from 'path';

const config = {
  mongodb: process.env.MONGODB || 'mongodb://localhost:27017/place-my-order',
  delay: 0,
  port: process.env.PORT || 3030,
  system: {
    config: path.join(__dirname, "..", "/public/package.json!npm"),
    main: "pmo/layout.stache!done-autorender"
  }
};

export default config;
