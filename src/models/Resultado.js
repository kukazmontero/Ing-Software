const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema(
    {
      Resultado: {
        type: Number,
        required: true,
      },
      materia: {
          type: String,
          required: true,
        },
      pregunta: {
          type: String,
          required: true,
        },
      prueba: {
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

module.exports = mongoose.model("Resultado", NoteSchema);