const Sauce = require("../models/sauces");

exports.createSauce = (req, res, next) => {
  const sauce = new Sauce({
    //userId: req.body.userId,
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    //imageUrl: req.body.imageUrl,
    heat: req.body.heat,
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "New sauce saved successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getOneSauce = (req, res, next) => {
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

exports.modifySauce = (req, res, next) => {
  const sauce = new Sauce({
    //userId: req.body.userId,
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    //imageUrl: req.body.imageUrl,
    heat: req.body.heat,
  });
  sauce
    .updateOne({ _id: req.params.id }, sauce)
    .then(() => {
      res.status(201).json({
        message: "Sauce updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({
    _id: req.params.id,
  })
    .then(() => {
      res.status(200).json({
        message: "Sauce deleted successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getAllSauces = (req, res, next) => {
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
