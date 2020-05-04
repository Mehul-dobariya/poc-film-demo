var request = require("supertest");
var app = require("../../app");
const expect = require('chai').expect;
const mongoose = require('mongoose');
const URI = "mongodb+srv://dbUser:dbUser@cluster0-v57ze.mongodb.net/testDB?retryWrites=true&w=majority";
const req = request(app);


describe(" /films", function () {
  this.timeout(5000);
  before(async (done) => {
    mongoose.connect(URI)
    console.log("Connected");
    done();
  });
  after((done) => {
    mongoose.disconnect()
    console.log("Disconnected");
    done();
  });
  let data = {
    "name": "Film TEST",
    "description": "TEST",
    "releaseDate": "2020-04-29T07:02:43.702Z",
    "ratings": 5,
    "ticketPrice": 7,
    "country": "Germany",
    "genre": ["Sci-Fi", "Comedy"],
  }

  // post add film call
  it('respond with 200 added', function () {
    this.timeout(5000);
    return req.post('/films/addFilms')
      .set('Accept', 'application/json')
      .send(data)
      .then(function (res) {
        // console.log("RES", res.body);
        expect(res.status).equal(200);
        expect(res.body.success).equal(true);
      });
  });
  //get filmlist api call
  it('should return all films', function () {
    return req.get('/films/films')
      .then(function (res) {
        // console.log("All films res", res.body);
        expect(res.status).equal(200);
        expect(res.body.success).equal(true);
      });
  });

  //get film detail api call
  it('should return film detail', function () {
    return req.get('/films/film/detail?id=5eb013deb4bff82210f0c92d')
      .then(function (res) {
        // console.log("films res", res.body);
        expect(res.status).equal(200);
        expect(res.body.success).equal(true);
      });
  });

  // register user
  it('respond with user registered', function () {
    this.timeout(5000);
    return req.post('/users/register')
      .set('Accept', 'application/json')
      .send({
        "name": "testUser101",
        "email": "user@test101.com",
        "password": "123456"
      })
      .then(function (res) {
        // console.log("RES", res.body);
        expect(res.status).equal(200);
        expect(res.body.success).equal(true);
      });
  });

  // login user
  let authToken = '';
  let userData = ""
  it('respond with jwt token', function () {
    this.timeout(5000);
    return req.post('/users/authenticate')
      .set('Accept', 'application/json')
      .send({
        "email": "user@test101.com",
        "password": "123456"
      })
      .then(function (res) {
        // console.log("LOGINRES", res.body);
        authToken = res.body.token;
        userData = res.body.user;
        expect(res.status).equal(200);
        expect(res.body.success).equal(true);
      });
  });

  // add comment
  it('respond with comment added', function () {
    this.timeout(5000);
    return req.post('/films/addComment')
      .set({ 'Accept': 'application/json', 'Authorization': 'Bearer ' + authToken })
      .send({
        "id": "5eb013deb4bff82210f0c92d",
        "text": "test comment",
        "user": userData
      })
      .then(function (res) {
        // console.log("comment RES", res.body);
        expect(res.status).equal(200);
        expect(res.body.success).equal(true);
      });
  });

})
