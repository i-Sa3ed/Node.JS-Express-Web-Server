require('dotenv').config();
const express = require('express');
const app = express(); // alternative to (server)
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const cookiePareser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const errorHandler = require('./middleware/errorHandlers');
const { logger } = require('./middleware/logEvents');
const verifyJWT = require('./middleware/verifyJWT');

const PORT = process.env.PORT || 3500;

// connnect to MongoDB
connectDB();

/// Custom middlware: logger example ///
app.use(logger);

/// Third-Party middleware ///

// Handle credentials - before CORS!
// and fetch cookies credential requirements
app.use(credentials);

// Cross-Origin Resource Sharing
app.use(cors(corsOptions));

/// Built-in Middleware ///

// for url-encoded data:
app.use(express.urlencoded({ extended: false }));

// for json data:
app.use(express.json());

// for cookies:
app.use(cookiePareser());

// for static files:
app.use(express.static(path.join(__dirname, '/public')));

/// routes ///
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT); // will be used for every module from here to down
app.use('/employees', require('./routes/api/employees'));
app.use('/users', require('./routes/api/users'));

// The default: 404 not found
app.all('*', (req, res) => {
    res.status(404); // Notice: explicitly define the status, else will be 200! 

    if (req.accepts('html'))
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    else if (req.accepts('json'))
        res.json({ error: "404 Not Found" });
    else
        res.type('txt').send("404 Not Found");
});

// custom error handler and logger
app.use(errorHandler);

// don't listen else we successfully connected to the db
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB...');
    app.listen(PORT, () => { console.log(`Server running on port ${PORT}`); });
});