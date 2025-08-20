const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// pick a random city and a random descriptor from the provided arrays
const sample = (array) => array[Math.floor(Math.random() * array.length)];

// async function to seed the database with 50 random campgrounds
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;  // price between $10 and $30
        /* getRandomInt(10, 50)} generates a random price between $10 and $50*/
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            /*finds a random city from the cities array and adds it to the campground's location*/
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget neque non arcu dictum lobortis. Nulla facilisi. Vestibulum semper, ipsum eget fermentum fring`,
            price
        })
        await camp.save();
    }
}
/* RANDOM NUMBER GENERATOR FUNCTION

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}*/
seedDB().then(()=>{
    mongoose.connection.close();
});