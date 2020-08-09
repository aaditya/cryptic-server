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

mongoose.connect("mongodb://localhost:27017/cryptic", mongoOptions, (err) => {
    if (err) { console.log(new Date(), err.message); }
    else { console.log(new Date(), 'Database Connected.'); }
})

// V1 Backend Routes
const routes = require('./routes');
app.use('/api/v1', routes);

app.listen(port, () => {
    console.log(new Date(), `Server Running on port ${port}.`);
});

module.exports = app;