const express = require("express");

const app = express();

const mongoose = require("mongoose");

const Sauce = require("./models/sauces");

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://hdy-p6:<AVcOC5BPG7WQsDbj>@cluster0.vvf9fuq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
/*
app.get("/api/sauces", (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
  next();
});

app.get("/api/sauces/:id", (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
  next();
});

app.post("/api/sauces", (req, res, next) => {
  delete req.body._id;
  const sauce = new Sauce({
    ...req.body,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
  next();
});
*/

const sauceRoute = require("./routes/sauces");
app.use("/api", sauceRoute);
module.exports = app;
