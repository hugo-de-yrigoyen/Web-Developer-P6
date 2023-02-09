const mongoose = require("mongoose");

//Module mongoose pour vérifier que l'email n'est pas déjà utilisé à la création d'un compte
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
