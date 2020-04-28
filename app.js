/**
 * Import node modules to use as a middleware
 */
const express = require('express');
const ConnectDb = require('./config/connection')
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');


/**
 * Connect to mongo via mongoose 
 */
ConnectDb();

/**
 * Initialize express and import routes for express
 */
const app = express();
const users = require('./routes/users');
const films = require('./routes/films');

/**
 * Backend application port
 */
const port = 5000;

/**
 * Accept requests to express from any domain:port,
 *  as react application will be running on different port
 */
app.use(cors());

/**
 * Folder in which frontend files will be located
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Convert request forms data in json
 */
app.use(bodyParser.json());

/**
 * Passport middleware to protect routes
 */
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

/**
 * Express Router for Users URL
 */
app.use('/users', users);
app.use('/films', films);

// app.use(multer({
//     dest: `./uploads/`,
//     rename: function (fieldname, filename) {
//         return filename;
//     },
// }));
/**
 * Express Router for base URL
 */
app.get('/', (req, res) => {
    res.send('invalid Endpoint');
});

/**
 * Start application
 */
app.listen(port, () => {
    console.log(`server started on port ${port}`);
});