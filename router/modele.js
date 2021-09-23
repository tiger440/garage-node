const express = require('express')
const router = express.Router();
const db = require("../database/db");

const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.post("/new", (req, res) => {
    console.log(req.body);
    db.marque.findOne({
            where: { id: req.body.marque },
        })
        .then((marque) => {
            if (marque) {
                db.modele
                    .findOne({
                        where: { modele: req.body.modele },
                    })
                    .then((modele) => {
                        if (!modele) {
                            db.modele
                                .create({
                                    modele: req.body.modele,
                                    marqueId: marque.id,
                                })
                                .then((modele) => {
                                    res.json(modele);
                                })
                                .catch((err) => {
                                    res.json(err);
                                });
                        } else {
                            res.json("can't add modele");
                        }
                    });
            } else {
                res.json("can't add modele");
            }
        });
})

router.get("/getByMarque/:marque", (req, res) => {
    db.modele
        .findOne({
            where: { marqueId: req.params.marque },
        })
        .then((marque) => {
            if (marque) {
                db.modele
                    .findOne({
                        where: { marqueId: marque.id },
                    })
                    .then((modeles) => {
                        res.json({ modeles: modeles });
                    })
                    .catch((err) => {
                        res.json(err);
                    });
            } else {
                res.json("can't find marque");
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

module.exports = router;

