const express = require('express');
const bp = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const useragent = require('express-useragent');

const app = express();
const port = process.env.PORT || 4000;

app.use(bp.json({ limit: "50mb" }));
app.use(bp.urlencoded({ extended: false, limit: "50mb" }));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());

app.use(useragent.express());

app.use(morgan('dev'));

const mongoOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
}

mongoose.connection.on('connecting', function () {
    console.log(new Date(), 'Establishing Database Connection');
});

mongoose.connection.on('error', function (error) {
    console.error(new Date(), 'Database Connection Error: ' + error.message);
    mongoose.disconnect();
});

mongoose.connection.on('connected', function () {
    console.log(new Date(), 'Database Connected');
});

mongoose.connection.once('open', function () {
    console.log(new Date(), 'Database Connection Established');
});

mongoose.connection.on('reconnected', function () {
    console.log(new Date(), 'Database ReConnected');
});

mongoose.connection.on('disconnected', function () {
    console.log(new Date(), 'Database Disconnected');
    mongoose.connect(process.env.MONGO_URI, mongoOptions);
});

mongoose.connect(process.env.MONGO_URI, mongoOptions);

// V1 Backend Routes
const routes = require('./routes');
app.use('/api/v1', routes);

app.use((req, res, next) => {
    res.status(404).json({ "message": "Route does not exist" });
})

app.listen(port, () => {
    console.log(new Date(), `Server Running on port ${port}.`);
});

module.exports = app;