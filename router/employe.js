const express = require("express");
const db = require("../database/db");
const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

process.env.SECRET_KEY = "secret";

router.post("/register", (req, res) => {
  db.emp
    .findOne({
      where: { email: req.body.email },
    })
    .then((employe) => {
      if (!employe) {
        const hash = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hash;
        db.emp
          .create(req.body)
          .then((emp) => {
            const employe = {
              nom: emp.nom,
              prenom: emp.prenom,
              email: emp.email,
              id: emp.id,
            };
            let token = jwt.sign(employe, process.env.SECRET_KEY, {
              expiresIn: 1440,
            });
            res.json({ token: token });
          })
          .catch((err) => {
            res.json(err);
          });
      } else {
        res.json({
          error: "employe already exists",
        });
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/login", (req, res) => {
  db.emp
    .findOne({ where: { email: req.body.email } })
    .then((emp) => {
      if (emp) {
        if (bcrypt.compareSync(req.body.password, emp.password)) {
          const employe = {
            nom: emp.nom,
            prenom: emp.prenom,
            email: emp.email,
            id: emp.id,
          };
          let token = jwt.sign(employe, process.env.SECRET_KEY, {
            expiresIn: 1440,
          });
          res.json({
            token: token,
          });
        } else {
          res.json("error mail or error password ");
        }
      } else {
        res.json("user not found");
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/findByGarageID/:id", (req, res) => {
  db.emp
    .findAll({
      where: { garageId: req.params.id },
      attributes: {
        include: [],
        // don't need to show this filed
        exclude: ["password", "updated_at", "created_at"],
      },
    })
    .then((emp) => {
      res.json(emp);
    })
    .catch((err) => {
      res.json(err);
    });
});
// update employe by id
router.put("/update/:id", (req, res) => {
  // get employe one by id
  db.emp
    .findOne({ where: { id: req.params.id } })
    .then((employe) => {
      if (employe) {
        // make hash of password in bcrypt, salt 10
        const hash = bcrypt.hashSync(req.body.password, 10);
        req.body.password = hash;
        employe
          .update(req.body)
          .then((employe) => {
            res.json({ employe: employe });
          })
          .catch((err) => {
            res.json(err);
          });
      } else {
        res.json("can't update this employe");
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

/* router.delete("/delete/:id", (req, res) => {
  db.emp
    .findOne({ where: { id: req.params.id } })
    .then((emp) => {
      if (emp) {
        emp
          .destroy()
          .then(() => {
            res.json({ stauts: "employe deleted" });
          })
          .catch((err) => {
            res.json(err);
          });
      } else {
        res.json("employe not found");
      }
    })
    .catch((err) => {
      res.json(err);
    });
}); */

router.delete("/delete/:id", (req, res) => {
  db.emp
    .destroy({
      where: { id: req.params.id },
    })
    .then((emp) => {
      if (emp) {
        res.json({ status: "employe deleted", emp });
      } else {
        res.json("employe not found");
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/findByEmail/:email", (req, res) => {
  db.emp
    .findOne({ where: { email: req.params.email } })
    .then((employe) => {
      if (employe) {
        res.json({ employe: employe });
      } else {
        res.json("employe not found");
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/all", (req, res) => {
  db.emp
    .findAll()
    .then((employes) => {
      if (employes) {
        res.json({ employes: employes });
      } else {
        res.json("employe not found");
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
