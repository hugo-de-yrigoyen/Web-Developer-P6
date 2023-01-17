const express = require("express");

const sauceRoute = express.Router();

const sauceCtrl = require("../controllers/sauces");

sauceRoute.get("/", sauceCtrl.getAllSauces);
sauceRoute.post("/", sauceCtrl.createSauce);
sauceRoute.get("/:id", sauceCtrl.getOneSauce);
sauceRoute.put("/:id", sauceCtrl.modifySauce);
sauceRoute.delete("/:id", sauceCtrl.deleteSauce);

module.exports = sauceRoute;
