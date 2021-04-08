const { config } = require('dotenv')

config();

const URL = `mongodb://${process.env.USER}:${process.env.PASS}@${process.env.HOST}:${process.env.PORT}/${process.env.DB}?authSource=admin`;

module.exports = {
    URL,
}