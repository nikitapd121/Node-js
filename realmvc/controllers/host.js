const Home = require('../models/home');

exports.getAddHome = (req, res) => {
  res.render('host/host2');
};
exports.getHostHome = (req, res) => {
  Home.fetchAll((homes) => {
    res.render('host/hosthomelist', { registeredHomes: homes });
  });
};
exports.homePage = (req, res) => {
  const { housename, price, location, rating } = req.body;
  const newHome = new Home(housename, price, location, rating);
  newHome.save();
  res.render('host/host');
};
