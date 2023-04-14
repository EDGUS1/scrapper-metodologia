const { Schema, model } = require('mongoose');

const tweetSchema = new Schema(
  {
    mensaje: String,
    likes: Number,
    url: String,
    fecha: String,
    // user: String,
    // username: String,
    comentarios: [
      {
        username: String,
        user: String,
        fecha: String,
        likes: Number,
        mensaje: String,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model('TweetTest', tweetSchema);
