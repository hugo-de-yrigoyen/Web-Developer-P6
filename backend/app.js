//Masque les données d'identification en les gardant en local dans le fichier .env
require("dotenv").config();

//Sécurise l'app express en modifiant les headers HTTP
const helmet = require("helmet");

//Middleware qui protège des attaques XSS en inspectant les requêtes et les URL
const xss = require("xss-clean");

//Module de protection contre les attaques par injection pour MongoDB
const mongoSanitize = require("express-mongo-sanitize");

//Limiteur de débit pour protéger contre le piratage de session
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, //Limite chaque IP à 100 requêtes maximum par fenêtre (par 15 minutes ici)
  standardHeaders: true, // Informations sur la limite de taux de retour dans les en-têtes « RateLimit-*»
  legacyHeaders: false, // Désactiver les en-têtes X-RateLimit-*
});

//Framework pour application web node.js
const express = require("express");

//On définit notre application fonctionnant avec express
const app = express();

//Middleware qui parse les requêtes afin de pouvoir les lire
const bodyParser = require("body-parser");

//Bibliothèque qui créé la connexion entre la base de donnée MongoDB et le serveur Node.js
const mongoose = require("mongoose");

//Plugin Mongoose pour signaler les erreurs dans la base de donnée
const mongodbErrorHandler = require("mongoose-mongodb-errors");
mongoose.plugin(mongodbErrorHandler);

//Importation des routes
const sauceRoutes = require("./routes/sauces");
const userRoutes = require("./routes/user");

//Module pour pouvoir naviguer dans le système de fichier
const path = require("path");

const uri =
  "mongodb+srv://" +
  process.env.USER_ID +
  ":" +
  process.env.USER_KEY +
  "@" +
  process.env.CLUSTER +
  ".mongodb.net/" +
  process.env.COLLECTION +
  "?retryWrites=true&w=majority";
mongoose.set("strictQuery", false);
mongoose
  .connect(uri, {
    serverSelectionTimeoutMS: 5000,
  })
  .catch((err) => console.log(err.reason));

//Middleware pour les requêtes cross-origin et prévenir les erreur CORS, ajoute des headers aux réponse pour le contrôle d'accès
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Préviens une erreur CORS
app.options("/*", (_, res) => {
  res.sendStatus(200);
});

app.use(bodyParser.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(xss());
app.use(mongoSanitize());
app.use(limiter);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
