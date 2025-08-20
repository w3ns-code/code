const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// pick a random city and a random descriptor from the provided arrays
const sample = (array)=> array[Math.floor(Math.random() * array.length)];

// async function to seed the database with 50 random campgrounds
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            /*finds a random city from the cities array and adds it to the campground's location*/
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
}
/* RANDOM NUMBER GENERATOR FUNCTION

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}*/
seedDB();