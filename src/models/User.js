const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema(
  {
    Nombre: { type: String, required: true, trim: true },
    RUT: { type: String, required: true, unique: true, trim: true},
    Password: { type: String, required: true },
    Tipo: { type: String, required: true},
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.methods.encryptPassword = async (Password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = bcrypt.hash(Password, salt);
  return hash;
};

UserSchema.methods.matchPassword = async function (Password) {
  return await bcrypt.compare(Password, this.Password);
};

module.exports = mongoose.model("User", UserSchema);