const config = {
  development: {
    mongoDbUrl:
      "mongodb+srv://perfectPitchDevUser:perfectPitchDevPassword@cluster0.botwl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  },
  production: {
    mongoDbUrl: `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.pupdp.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`,
  },
};

const env: keyof typeof config = process.env.NODE_ENV === "production" ? "production" : "development";

export default config[env];
