const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getsignup = (req, res) => {
  res.render('store/signup', {
    pageTitle: 'Sign Up',
    errorMessage: null,
    oldInput: { name: '', email: '' },
    user: req.session.user || null
  });
};

exports.postsignup = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').normalizeEmail().isEmail().withMessage('Please enter a valid email.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords do not match.');
    return true;
  }),
  async (req, res) => {
    const { name, email, password, accountType } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render('store/signup', {
        pageTitle: 'Sign Up',
        errorMessage: errors.array().map(err => err.msg).join(' | '),
        oldInput: { name, email },
        user: null
      });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(422).render('store/signup', {
          pageTitle: 'Sign Up',
          errorMessage: 'Email already exists.',
          oldInput: { name, email },
          user: null
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({ name, email, password: hashedPassword, accountType });
      await newUser.save();

      req.session.isLoggedIn = true;
      req.session.user = newUser;
      req.session.save(() => {
        if (accountType === 'host') return res.redirect('/host/host-home');
        return res.redirect('/');
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
];

exports.getlogin = (req, res) => {
  res.render('store/login', {
    pageTitle: 'Login Page',
    errorMessage: null,
    oldInput: { email: '' },
    user: req.session.user || null
  });
};

exports.postlogin = [
  body('email').normalizeEmail().isEmail().withMessage('Enter a valid email.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render('store/login', {
        pageTitle: 'Login',
        errorMessage: errors.array().map(err => err.msg).join(' | '),
        oldInput: { email },
        user: null
      });
    }

    try {
      const foundUser = await User.findOne({ email });
      if (!foundUser) {
        return res.status(401).render('store/login', {
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: { email },
          user: null
        });
      }

      const isMatch = await bcrypt.compare(password, foundUser.password);
      if (!isMatch) {
        return res.status(401).render('store/login', {
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: { email },
          user: null
        });
      }

      req.session.isLoggedIn = true;
      req.session.user = foundUser;
      req.session.save(() => {
        if (foundUser.accountType === 'host') return res.redirect('/host/host-home');
        return res.redirect('/');
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
];

exports.getlogout = (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.redirect('/login');
  });
};