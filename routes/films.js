/**
 * Import node modules
 */
const express = require('express');
const Router = express.Router();
const moment = require("moment");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const multer = require('multer');
const path = require('path');
const Film = require('../models/film');
var helper = require('./helper');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
var upload = multer({
    storage: storage
})
// const Film = require('../models/film');

/** 
 * GET Requests starts here 
 * 
 */
/**
 * List Films
 */
Router.get('/films', (req, res) => {
    Film.getAllFilm(async (err, filmList) => {
        if (err) {
            console.log("err", err);
            res.json({
                'success': false,
                'message': 'Error while fetching film data'
            });
        } else {
            await filmList.map((film, index) => {
                filmList[index]["photo"] = "http://localhost:5000/uploads/" + film.photo
            })
            res.json({
                'success': true,
                'message': 'success',
                data: filmList
            });
        }
    });
})

/**
 * Film by id
 */
Router.get('/film/detail', (req, res) => {
    Film.getFilmById(req.query.id, (err, filmData) => {
        if (err) throw err;
        if (!filmData) {
            return res.json({
                'success': false,
                'message': 'Film not found.'
            });
        } else {
            filmData["photo"] = "http://localhost:5000/uploads/" + filmData.photo;
            res.json({
                'success': true,
                'message': 'success',
                'data': filmData
            });
        }
    });
})
/** GET requests ends here */

/** 
 * POST requests starts here 
 */
/**
 * Add new Film
 */

Router.post('/addFilms', upload.single('filmPic'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const err = new Error("Please upload file");
        error.httpStatusCode = 400;
        return next(error);
    }
    let newFilm = new Film({
        'name': req.body.name,
        'description': req.body.description,
        'releaseDate': new Date(req.body.releaseDate),
        'ratings': req.body.ratings,
        'ticketPrice': req.body.ticketPrice,
        'country': req.body.country,
        'genre': req.body.genre,
        'photo': file.filename
    });
    Film.addFilm(newFilm, (err, film) => {
        if (err) {
            console.log("err", err);
            res.json({
                'success': false,
                'message': 'Failed to save Film.'
            });
        } else {
            res.json({
                'success': true,
                'message': 'Film added successfully'
            });
        }
    });
});

/**
 * Add new comment
 */
Router.post('/addComment', helper.verifyToken, (req, res, next) => {
    let newComment = {
        'id': req.body.id,
        'data': { "author": req.body.user, "text": req.body.text }
    };
    Film.addComment(newComment, (err, comment) => {
        if (err) {
            console.log("err", err);
            res.json({
                'success': false,
                'message': 'Failed to save comment.'
            });
        } else {
            // populate new comment
            Film.getFilmById(req.body.id, (err, filmData) => {
                if (err) throw err;
                if (!filmData) {
                    return res.json({
                        'success': false,
                        'message': 'Film not found.'
                    });
                } else {
                    filmData["photo"] = "http://localhost:5000/uploads/" + filmData.photo;
                    res.json({
                        'success': true,
                        'message': 'success',
                        'data': filmData
                    });
                }
            });
        }
    });
});
module.exports = Router;