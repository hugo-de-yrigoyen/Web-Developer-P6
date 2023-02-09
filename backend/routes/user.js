const express = require("express");
const userRoutes = express.Router();
const userCtrl = require("../controllers/user");
const password = require("../middleware/password");

userRoutes.post("/signup", password, userCtrl.signup);
userRoutes.post("/login", userCtrl.login);

module.exports = userRoutes;
