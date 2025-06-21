const Home = require('../models/home');

exports.getHomes = (req, res) => {
  Home.fetchAll((homes) => {
    res.render('store/user', { registeredHomes: homes });
  });
};
exports.getBookings= (req, res) => {
  Home.fetchAll((homes) => {
    res.render('store/booking.ejs', { registeredHomes: homes });
  });
};
exports.favlist= (req, res) => {
  Home.fetchAll((homes) => {
    res.render('store/fav.ejs', { registeredHomes: homes });
  });
};
exports.index= (req, res) => {
  Home.fetchAll((homes) => {
    res.render('store/index.ejs', { registeredHomes: homes });
  });
};