//Intègre les JSON web tokens afin de faire des échanges sécurisés avec la base de donnée
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; //Récupère le token dans le header
    const decodedToken = jwt.verify(token, `${process.env.TOKEN}`); //Déchiffre le token à partir de la clé
    const userId = decodedToken.userId;
    //Vérifie la correspondance entre le userID de la base de donnée et celui de la requête
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
