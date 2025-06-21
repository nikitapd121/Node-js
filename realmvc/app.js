const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const hostRoutes = require('./routes/hostr');
const userRoutes = require('./routes/userr'); // ✅ FIXED: Correct route file

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/',userRoutes);
app.use('/host', hostRoutes);
app.use('/host', userRoutes); 

const Home = require('./models/home');

app.get('/', (req, res) => {
  Home.fetchAll((homes) => {
    res.render('store/user', { registeredHomes: homes });
  });
});

app.use((req, res) => {
  res.status(404).send('<b>Page not found.</b>');
});

app.listen(3080, () => {
  console.log('Server is running at http://localhost:3080');
});
