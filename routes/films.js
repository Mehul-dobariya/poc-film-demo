/**
 * Import node modules
 */
const express = require('express');
const Router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
// const Film = require('../models/film');

/** 
 * GET Requests starts here 
 * 
 */
/**
 * Profile router
 */
Router.get('/profile', passport.authenticate('jwt', {
    'session': false
}), (req, res, next) => {
    res.json({
        'user': req.user
    });
});
/** GET requests ends here */

/** 
 * POST requests starts here 
 */
/**
 * Registration router
 */

Router.post('/register', (req, res, next) => {
    let newUser = new User({
        'name': req.body.name,
        'email': req.body.email,
        'userName': req.body.userName,
        'password': req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({
                'success': false,
                'message': 'Failed to register user.'
            });
        } else {
            res.json({
                'success': true,
                'message': 'User registered.'
            });
        }
    });
});

/**
 * Authenticate router
 */
Router.post('/authenticate', (req, res, next) => {
    const userName = req.body.userName;
    const password = req.body.password;

    User.getUserByUserName(userName, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({
                'success': false,
                'message': 'User not found.'
            });
        } else {
            User.comparePassword(password, user.password, (err, isMatched) => {
                if (err) throw err;
                if (isMatched) {
                    const token = jwt.sign(user.toJSON(), config.secret, {
                        'expiresIn': 604800 /*1 week to seconds */
                    });
                    res.json({
                        'success': true,
                        'token': `JWT ${token}`,
                        'user': {
                            'id': user._id,
                            'name': user.name,
                            'userName': user.userName,
                            'email': user.email
                        }
                    });
                } else {
                    return res.json({
                        'success': false,
                        'message': 'Incorrect password.'
                    });
                }
            });
        }
    });

});
/** POST requests ends here */

module.exports = Router;