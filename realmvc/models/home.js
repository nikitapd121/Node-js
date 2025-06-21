const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'homes.json');

module.exports = class Home {
  constructor(houseName, price, location, rating, photo) {
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photo = photo;
  }

  save() {
    Home.fetchAll((homes) => {
      homes.push(this);
      fs.writeFile(filePath, JSON.stringify(homes), (err) => {
        if (err) console.log('Error writing file:', err);
      });
    });
  }

  static fetchAll(cb) {
    fs.readFile(filePath, (err, data) => {
      if (err) return cb([]);
      try {
        const homes = JSON.parse(data);
        cb(homes);
      } catch (e) {
        cb([]);
      }
    });
  }
};
