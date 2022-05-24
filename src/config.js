const {config}  = require('dotenv');
config();

const configurations = {
  PORT: process.env.PORT || 3000,
  MONGODB_HOST: process.env.MONGODB_HOST || "localhost",
  MONGODB_DATABASE: process.env.MONGODB_DB || "software",
  MONGODB_URI: `mongodb+srv://kuky:123@cluster1.l8fea.mongodb.net/?retryWrites=true&w=majority}/${
    process.env.MONGODB_DATABASE || "software"
  }`,
};

module.exports = configurations;