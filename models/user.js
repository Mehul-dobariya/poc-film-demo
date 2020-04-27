/**
 * Import node modules
 */
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const bcrypt = require('bcryptjs');
const config = require('../config/config');

/**
 * User schema attributes
 */
const UserSchema = mongoose.Schema({
    'name': {
        'type': String
    },
    'email': {
        'type': String,
        'required': true
    },
    'userName': {
        'type': String,
        'required': true
    },
    'password': {
        'type': String,
        'required': true
    }
});

/**
 * Export mongoose model
 */
const User = module.exports = mongoose.model('User', UserSchema);


/**
 * @param {number} id - Unique user id.
 * @param {Object} callback - User object.
 * @param {*} callback.id - User id.
 * @param {String} callback.name - User name.
 * @param {String} callback.email - User email.
 * @param {String} callback.userName - User userName.
 */
module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
};

/**
 * Query User by userName.
 */
/**
 * @param {number} userName - Unique userName.
 * @param {Object} callback - User object.
 * @param {*} callback.id - User id.
 * @param {String} callback.name - User name.
 * @param {String} callback.email - User email.
 * @param {String} callback.userName - User userName.
 */
module.exports.getUserByUserName = (userName, callback) => {
    const query = {
        'userName': userName
    };
    User.findOne(query, callback);
};

/**
 * Add user
 */
module.exports.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            await newUser.save(callback);
        });
    });
};

/**
 * Compare password
 */
module.exports.comparePassword = (password, hash, callback) => {
    bcrypt.compare(password, hash, (err, isMatched) => {
        if (err) throw err;
        callback(null, isMatched);
    });
};