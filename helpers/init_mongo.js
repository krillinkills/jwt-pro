const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
  })
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

mongoose.connection.on('connected', () => {
  console.log('DB connected');
});

mongoose.connection.on('error', () => {
  console.log('err');
});

mongoose.connection.on('disconnecte', () => {
  console.log('DB disconected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
