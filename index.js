const express = require('express');

const app = express();
const port = process.env.PORT || 4000;

// V1 Backend Routes
const routes = require('./routes');
app.use('/api/v1', routes);

app.listen(port, () => {
    console.log(new Date(), `Server Running on port ${port}.`);
});

module.exports = app;