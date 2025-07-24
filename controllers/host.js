const Home = require('../models/home');

exports.getAddHome = (req, res) => {
  res.render('host/host2', {
    home: {},
    isLoggedIn: req.isLoggedIn,
    user: req.session.user || null
  });
};

exports.getHostHome = (req, res) => {
  Home.find()
    .then(homes => {
      res.render('host/hosthomelist', {
        registeredHomes: homes,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user || null
      });
    })
    .catch(err => {
      console.error('Error fetching host homes:', err);
      res.status(500).send('Error loading host homes.');
    });
};

exports.homePage = (req, res) => {
  const { housename, price, location, rating, photo, description } = req.body;

  const newHome = new Home({
    houseName: housename,
    price,
    location,
    rating,
    photo,
    description
  });

  newHome.save()
    .then(() => {
      console.log("Home saved successfully");
      res.redirect('/');
    })
    .catch(err => {
      console.error('Error saving home:', err);
      res.status(500).send('Error saving home.');
    });
};

exports.editpage = (req, res) => {
  const homeId = req.params.homeId;

  Home.findById(homeId)
    .then(home => {
      if (!home) return res.redirect('/host/host-home');
      res.render('host/edithome', {
        home,
        user: req.session.user || null
      });
    })
    .catch(err => {
      console.error('Error finding home:', err);
      res.status(500).send('Error loading edit page.');
    });
};

exports.postEditHome = async (req, res) => {
  try {
    const { id, housename, price, location, rating, description } = req.body;
    const updateData = {
      houseName: housename,
      price,
      location,
      rating,
      description
    };

    if (req.file) {
      updateData.photo = '/uploads/' + req.file.filename;
    }

    await Home.findByIdAndUpdate(id, updateData);
    res.redirect('/host/host-home');
  } catch (err) {
    console.error('Error updating home:', err);
    res.status(500).send('Failed to update home.');
  }
};

exports.deletekaro = (req, res) => {
  const homeId = req.params.homeId;

  Home.findByIdAndDelete(homeId)
    .then(() => res.redirect('/host/host-home'))
    .catch(err => {
      console.error('Error deleting home:', err);
      res.status(500).send('Error deleting home.');
    });
};
exports.postAddHome = async (req, res) => {
  try {
    const { housename, price, location, rating, description } = req.body;
    const photoPath = req.file ? '/uploads/' + req.file.filename : '';

    const newHome = new Home({
      houseName: housename,
      price,
      location,
      rating,
      description,
      photo: photoPath,
      userId: req.session.user._id
    });

    await newHome.save();
    res.redirect('/host/host-home');
  } catch (err) {
    console.error('Error saving home:', err);
    res.status(500).send('Failed to add home.');
  }
};
