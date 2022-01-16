const { Schema, model } = require('mongoose');

const mensajeSchema = new Schema(
  {
    mensaje: String,
    likes: Number,
    url: String,
    fecha: String,
    user: String,
    username: String,
    // comentarios: [{ username: String, fecha: String, likes: Number }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model('Mensaje', mensajeSchema);
