const express = require("express");
const { atelier } = require("../database/db");
const router = express.Router();
const db = require("../database/db");

router.post("/new", (req, res) => {
  db.atelier
    .findOne({
      where: { nom: req.body.nom, garageId: req.body.garageId },
    })
    .then((atelier) => {
      if (!atelier) {
        db.atelier
          .create(req.body)
          .then((response) => res.json(response))
          .catch((err) => {
            res.json(err);
          });
      }
    });
});

module.exports = router;
