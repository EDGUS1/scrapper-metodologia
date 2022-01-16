const mongoose = require('mongoose');

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DATABASE}?retryWrites=true&w=majority`
  )
  .then(() => console.log('DB connected'))
  .catch(err => console.log(err));
