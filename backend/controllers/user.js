const User = require("../models/user");

//Générateur de hash pour les mots de passe
const bcrypt = require("bcrypt");

//Intègre les JSON web tokens afin de faire des échanges sécurisés avec la base de donnée
const jwt = require("jsonwebtoken");

//Créer un compte
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({ email: req.body.email, password: hash });
      console.log(user);
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//Se connecter
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }

          //Jwt chiffre le nouveau token avec userID, la clé pour crypter le token et ce token expire dans 24 heures
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, `${process.env.TOKEN}`, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
