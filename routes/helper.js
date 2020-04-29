const jwt = require('jsonwebtoken');
const config = require('../config/config');
module.exports = {
    // verify token
    verifyToken: function (req, res, next) {
        const bearerHeader = req.headers['authorization']
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            // req.token = bearerToken;
            jwt.verify(bearerToken, config.secret, (err, authData) => {
                if (err) {
                    res.sendStatus(403);
                } else {
                    next();
                }
            })
        } else {
            // Forbidden
            res.sendStatus(403);
        }
    },
};