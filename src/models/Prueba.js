const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      materia: {
          type: String,
          required: true,
        },
      preguntas: {
          type: Number,
          required: true,
        },
      estado: {
           type: String,
           required: true,
        },
      user: {
        type: String,
        required: true,
      },
      date: {
          type: Date,
          default: Date.now
      }
    }
    
);

module.exports = mongoose.model("Prueba", NoteSchema);