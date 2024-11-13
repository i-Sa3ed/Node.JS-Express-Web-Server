const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) // remove the second operand before publishing!
            callback(null, true);
        else
            callback(new Error('Not allowed by CORS'));
    },
    optionsSuccessStatus: 200
};

module.exports = corsOptions;