const mongoose = require('mongoose');

const URI = "mongodb+srv://dbUser:dbUser@cluster0-v57ze.mongodb.net/film_demo?retryWrites=true&w=majority";

const connectDB = async () => {
  await mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }, (err) => {
    if (err) console.log(err);
  });
  console.log('db connected..!');
};

module.exports = connectDB;