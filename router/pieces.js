const express = require('express')
const router = express.Router();
const db = require("../database/db");

router.post('/', (req, res) => {
    const infopieces = {
        ref_piece: req.body.ref_piece,
        name: req.body.name,
        prix: req.body.prix,
        stock: req.body.stock,
        marqueId: null,
        typemoteurId: null,
        anneeId: null,
        modeleId: null,
    };
    const infomarque = { marque: req.body.marque }
    const infomodele = { modele: req.body.modele }
    const infotypemoteur = { type_moteur: req.body.type_moteur }
    const infotypepiece = { type_piece: req.body.typepiece }

    db.pieces.findOne({
        where: { ref_piece: infopieces.ref_piece }
    })
});