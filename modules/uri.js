const { config } = require('dotenv')

config();

// const URI = `mongodb://${process.env.USER}:${process.env.PASS}@${process.env.HOST}:${process.env.PORT}\\${process.env.DB}`;
const URI = `mongodb://${process.env.USER}:${process.env.PASS}@${process.env.HOST}:${process.env.PORT}`;
const DB = `${process.env.DB}`;

module.exports = {
    URI,
    DB
}