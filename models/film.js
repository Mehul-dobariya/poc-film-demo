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
        'type': Array,
        'required': true
    },
    'photo': {
        'data': Buffer,
        'contentType': String,
        'required': true
    },
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
module.exports.getFilmById = (id, callback) => {
    Film.findById(id, callback);
};

/**
 * Query Film by filmName.
 */
/**
 * @param {number} userName - Unique filmName.
 * @param {Object} callback - Film object.
 * @param {*} callback.id - Film id.
 * @param {String} callback.name - Film name.
 * @param {String} callback.email - Film email.
 * @param {String} callback.userName - Film filmName.
 */
module.exports.getUserByUserName = (userName, callback) => {
    const query = {
        'userName': userName
    };
    User.findOne(query, callback);
};

/**
 * Add film
 */
module.exports.addFilm = async (newFilm, callback) => {
    var newItem = new Item();
    newItem.img.data = fs.readFileSync(newFilm.files.filmPhoto.path)
    newItem.img.contentType = `image / png`;
    await newItem.save(callback);

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