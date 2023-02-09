const express = require("express");
const auth = require("../middleware/auth");
const sauceRoutes = express.Router();
const sauceCtrl = require("../controllers/sauces");
const multer = require("../middleware/multer-config");

sauceRoutes.get("/", auth, sauceCtrl.getAllSauces);
sauceRoutes.post("/", auth, multer, sauceCtrl.createSauce);
sauceRoutes.post("/:id/like", auth, sauceCtrl.likeSauce);
sauceRoutes.get("/:id", auth, sauceCtrl.getOneSauce);
sauceRoutes.put("/:id", auth, multer, sauceCtrl.modifySauce);
sauceRoutes.delete("/:id", auth, sauceCtrl.deleteSauce);

module.exports = sauceRoutes;
