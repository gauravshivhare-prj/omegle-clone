require('dotenv').config(); 

module.exports = {
    PORT: process.env.PORT || 5000,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    CORS_METHODS: process.env.CORS_METHODS
        ? process.env.CORS_METHODS.split(',')
        : []
};