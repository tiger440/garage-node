const express = require("express");
const { garage } = require("../database/db");
const router = express.Router();

const db = require("../database/db");

router.get("/", (req, res) => {
  db.garage
    .findAll({
      attributes: {
        include: [],
        // don't need to show this filed
        exclude: ["updated_at", "created_at"],
      },
      include: [
        {
          model: db.atelier,
          attributes: {
            include: [],
            // don't need to show this filed
            exclude: ["garageId", "updated_at", "created_at"],
          },
        },
      ],
    })
    .then((garage) => {
      if (garage) {
        res.json({
          garages: garage,
        });
      } else {
        res.json({ error: "pas de garage" });
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/", (req, res) => {
  db.garage
    .create(req.body)
    .then((garage) => {
      res.status(200).json(garage);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/:id", (req, res) => {
  db.garage
    .findOne({
      attributes: {
        include: [],
        // don't need to show this filed
        exclude: ["updated_at", "created_at"],
      },
      include: [
        {
          model: db.atelier,
          attributes: {
            include: [],
            // don't need to show this filed
            exclude: ["garageId", "updated_at", "created_at"],
          },
        },
      ],

      where: { id: req.params.id },
    })
    .then((garage) => {
      res.json(garage);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
