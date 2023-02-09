const passwordValidator = require("password-validator");

const schema = new passwordValidator();

schema
  .is()
  .min(8) //Minimum 8 caractères
  .is()
  .max(100) //Maximum 100 caractères
  .has()
  .uppercase() //Doit avoir au moins une lettre majuscule
  .has()
  .lowercase() //Doit avoir au moins une lettre minuscule
  .has()
  .digits(2) //Doit avoir au moins 2 chiffres

  .has()
  .not()
  .spaces() //Ne doit pas avoir d'espaces
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]); //Mettre ces valeurs sur liste noire

module.exports = (req, res, next) => {
  if (schema.validate(req.body.password)) {
    next();
  } else {
    return res.status(400).json({
      message:
        "Mot de passe pas assez sécurisé :" +
        schema.validate("req.body.password", {
          list: true,
        }),
    });
  }
};
