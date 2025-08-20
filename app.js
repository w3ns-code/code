const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//we need to use express.urlencoded to parse form data
app.use(express.urlencoded({ extended: true }));
//we need to use method-override to handle PUT and DELETE requests
app.use(methodOverride('_method'));
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});
//we have to put new before the :id to avoid the new being interpreted as an id and not a new campground
//so the more specific route should come first
app.get('/campgrounds/new', async (req, res) => {
    res.render('campgrounds/new');
});
app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
    // this will redirect to the show page of the newly created campground
    /*Without the app.get('/campgrounds/:id') route, the server would not 
    know how to handle requests to URLs like /campgrounds/12345, where 12345 is the ID of a campground.*/
});
app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground })
});
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
});
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground }, { new: true });
    //we use the three dots(the spread operator) because it is used to take all the properties 
    //from req.body.campground and spread them into a new object. If we don't use the spread operator,
    //the updated campground would not have the new properties from the request body.
    // This is useful for updating a document in the database with the new values provided in the 
    // request body.

    res.redirect(`/campgrounds/${campground._id}`);
});
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.listen(3000, () => {
    console.log('LISTENING on port 3000');
});