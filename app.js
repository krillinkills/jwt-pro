const express = require('express');
const app = express();
const createErrors = require('http-errors');
require('dotenv').config();
const authRoute = require('./routes/Auth.routes');
const morgan = require('morgan');
require('./helpers/init_mongo');

//helpers
app.use(morgan());
app.use(express.json());

app.use('/auth', authRoute);

//not found
app.use((req, res, next) => {
  next(createErrors.NotFound());
});

//error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: error,
      message: err.message,
    },
  });
});

app.use((req, res, next) => {
  next(createErrors.NotFound());
});

const port = process.env.PORT;
app.listen(port, () => console.log(`server running on port ${port}`));
