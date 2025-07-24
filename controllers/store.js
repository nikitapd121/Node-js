const Home = require('../models/home');
const Fav = require('../models/fav');

exports.index = (req, res) => {
  Home.find()
    .then(registeredHomes => {
      res.render('store/user', {
        registeredHomes,
        pageTitle: "Tumhara airbnb",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user || null
      });
    })
    .catch(err => {
      console.error("Error loading homes:", err);
      res.status(500).send("Could not load homes.");
    });
};

exports.getHomes = (req, res) => {
  Home.find()
    .then(rows => {
      res.render('store/user.ejs', {
        registeredHomes: rows,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user || null
      });
    })
    .catch(err => {
      console.error("Error loading homes:", err);
      res.status(500).send("Could not load homes.");
    });
};

exports.getBookings = (req, res) => {
  Home.find()
    .then(rows => {
      res.render('store/booking.ejs', {
        registeredHomes: rows,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user || null
      });
    })
    .catch(err => {
      console.error("Error loading bookings:", err);
      res.status(500).send("Could not load bookings.");
    });
};

// controllers/store.js
exports.favlist = async (req, res) => {
  try {
    const favs = await Fav.find({ userId: req.session.user._id }).populate('houseId');
    const favHomes = favs.map(f => f.houseId);

    res.render('store/fav.ejs', {
      registeredHomes: favHomes,
      isLoggedIn: req.isLoggedIn,
      pageTitle: "Favourites",
      currentPage: "fav",
      user: req.session.user || null
    });
  } catch (err) {
    console.error("Error fetching favourites:", err);
    res.status(500).send("Could not load favourite homes.");
  }
};

exports.postfav = async (req, res) => {
  const id = req.body.id;
  const userId = req.session.user._id;
  if (!id) return res.redirect('/');

  try {
    const exists = await Fav.findOne({ houseId: id, userId });
    if (!exists) {
      const fav = new Fav({ houseId: id, userId });
      await fav.save();
    }
    res.redirect('/fav');
  } catch (err) {
    console.error("Error saving favorite:", err);
    res.status(500).send("Could not save favorite.");
  }
};


exports.favdeletekaro = async (req, res) => {
  const id = req.body.id;
  const userId = req.session.user._id;
  try {
    await Fav.deleteOne({ houseId: id, userId });
    res.redirect('/fav');
  } catch (err) {
    console.error("Error deleting from fav:", err);
    res.status(500).send("Could not remove favorite.");
  }
};


exports.homeID = (req, res) => {
  const homeid = req.params.homeId;

  Home.findById(homeid)
    .then(home => {
      if (!home) return res.status(404).send('Home not found');
      res.render("store/homedetails.ejs", {
        home,
        isLoggedIn: req.isLoggedIn,
        pageTitle: "Home Detail",
        currentPage: "home-details",
        user: req.session.user || null
      });
    })
    .catch(err => {
      console.error("Error fetching home:", err);
      res.status(500).send("Error loading home details.");
    });
};
