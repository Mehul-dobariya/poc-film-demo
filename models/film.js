/**
 * Import node modules
 */
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const bcrypt = require('bcryptjs');
const config = require('../config/config');

/**
 * Film schema attributes
 */
const FilmsSchema = mongoose.Schema({
    'name': {
        'type': String,
        'required': true
    },
    'description': {
        'type': String,
        'required': true
    },
    'releaseDate': {
        'type': Date,
        'required': true
    },
    'ratings': {
        'type': Number,
        'required': true
    },
    'ticketPrice': {
        'type': Number,
        'required': true
    },
    'country': {
        'type': String,
        'required': true
    },
    'genre': {
        'type': Object,
        'required': true
    },
    'photo': {
        'type': String,
        'required': true
    },
    'comments': {
        'type': Array,
        'value': [{}]
    }
});

/**
 * Export mongoose model
 */
const Film = module.exports = mongoose.model('Film', FilmsSchema);


/**
 * @param {number} id - Unique film id.
 * @param {Object} callback - Film object.
 * @param {*} callback.id - Film id.
 * @param {String} callback.name - Film name.
 * @param {String} callback.email - Film email.
 * @param {String} callback.userName - Film userName.
 */
module.exports.getAllFilm = (callback) => {
    Film.find(null, callback);
};

/**
 * @param {number} id - Unique film id.
 * @param {Object} callback - Film object.
 * @param {*} callback.id - Film id.
 * @param {String} callback.name - Film name.
 * @param {String} callback.email - Film email.
 * @param {String} callback.userName - Film userName.
 */
module.exports.getFilmById = (id, callback) => {
    Film.findById(id, callback);
};

/**
 * Add film
 */
module.exports.addFilm = async (newFilm, callback) => {
    await newFilm.save(callback);
};

/**
 * Add comment
 */
module.exports.addComment = async (newComment, callback) => {
    await Film.updateOne({ "_id": newComment.id }, { $addToSet: { "comments": newComment.data } }, callback);
};
