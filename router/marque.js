const express = require("express"),
    router = express.Router(),
    db = require("../database/db");

router.post("/", (req, res) => {
    const infomarque = { marque: req.body.marque };
    const infomodele = {
        modele: req.body.modele,
        marqueId: null,
    };
    db.marque
        .findOne({
            where: { marque: infomarque.marque },
        })
        .then((marque) => {
            if (!marque) {
                db.marque
                    .create(infomarque)
                    .then((marque) => {
                        infomodele.marqueId = marque.id;
                        db.modele
                            .findOne({
                                where: { modele: infomodele.modele, marqueId: marque.id },
                            })
                            .then((modele) => {
                                if (!modele) {
                                    db.modele
                                        .create(infomodele)
                                        .then((modele) => {
                                            res.json(modele);
                                        })
                                        .catch((err) => {
                                            res.json(err);
                                        });
                                } else {
                                    res.json("can't add modele");
                                }
                            })
                            .catch((err) => {
                                res.json(err);
                            });
                    })
                    .catch((err) => {
                        res.json(err);
                    });
            } else {
                infomodele.marqueId = marque.id;
                db.modele
                    .findOne({
                        where: { modele: infomodele.modele },
                    })
                    .then((modele) => {
                        if (!modele) {
                            db.modele
                                .create(infomodele)
                                .then((modele) => {
                                    res.json(modele);
                                })
                                .catch((err) => {
                                    res.json(err);
                                });
                        } else {
                            res.json("can't add modele");
                        }
                    })
                    .catch((err) => {
                        res.json(err);
                    });
            }
        })
        .catch((err) => {
            res.json(err);
        });
});

router.get("/", (req, res) => {
    db.marque
        .findAll({
            include: [{
                all: true,
                /* model: db.modele, */
            }, ],
        })
        .then((marque) => {
            res.json({ marque: marque });
        })
        .catch((err) => {
            res.json(err);
        });
});

module.exports = router;