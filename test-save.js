const Home = require('./models/home');

const testHome = new Home(
  'Lakeview Cottage',    // houseName
  3000,                  // price
  'Nainital',            // location
  5,                     // rating
  'lake.jpg',            // photo
  'Beautiful view of the lake' // description
  // id is optional for save()
);

testHome.save()
  .then(() => {
    console.log('✅ Home saved successfully!');
  })
  .catch((err) => {
    console.error('❌ Error saving home:', err);
  });
