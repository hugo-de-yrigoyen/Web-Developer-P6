const Sauce = require("../models/sauces");

//Créé et gère des fichiers, ici les images des sauces
const fs = require("fs");

//Créer une nouvelle sauce
exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Sauce créée !",
      });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Like ou dislike une sauce
exports.likeSauce = (req, res) => {
  console.log(req.body);
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //Si l'utilisateur a like la sauce
      if (req.body.like === 1) {
        sauce.usersLiked.push(req.body.userId);
        //Si l'utilisteur a dislike la sauce
      } else if (req.body.like === -1) {
        sauce.usersDisliked.push(req.body.userId);
      } else if (req.body.like === 0) {
        // Si l'utilisateur a annulé son like
        if (sauce.usersLiked.includes(req.body.userId)) {
          const userIdLiked = sauce.usersLiked.indexOf(req.body.userId);
          sauce.usersLiked.splice(userIdLiked, 1);
        }
        // Si l'utilisateur a annulé son dislike
        if (sauce.usersDisliked.includes(req.body.userId)) {
          const userIdDisliked = sauce.usersDisliked.indexOf(req.body.userId);
          sauce.usersDisliked.splice(userIdDisliked, 1);
        }
      }
      //Mise à jour du nombre total de likes et dislikes
      sauce.likes = sauce.usersLiked.length;
      sauce.dislikes = sauce.usersDisliked.length;
      sauce
        .save()
        .then(() => res.status(200).json({ message: "Likes mis à jour" }))
        .catch((error) => {
          res.status(400).json({ error });
        });
    })
    .catch((error) => res.status(400).json({ error }));
};

//Afficher une sauce précise
exports.getOneSauce = (req, res) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

//Modifier une sauce
exports.modifySauce = (req, res) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //Vérifie que c'est l'utilisateur qui a créé la sauce
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "non autorisé !" });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce modifiée" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

//Supprimer une sauce
exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //Vérifie que c'est l'utilisateur qui a créé la sauce
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Mauvais utilisateur" });
      } else {
        //Trouve le chemin de l'image et la supprime
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          //Supprime la sauce
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce supprimée" }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

//Afficher toutes les sauces
exports.getAllSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
