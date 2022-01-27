/************************************** Start Require module ****************************************************
 *****************************************************************************************************************/
/**
 *Express.js
 * is a framework for building web applications based on Node.js.
 * This is the standard framework for server development in Node.js.
 **/
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).
 * Each route can have one or more handler functions, which are executed when the route is matched.
 * Route definition takes the following structure:
 * router.METHOD (PATH, HANDLER)
 *
 * GET : The GET method requests a representation of the specified resource. Requests using GET should only retrieve data and should have no other effect. (This is also true of some other HTTP methods.)[1] The W3C has published guidance principles on this distinction, saying, "Web application design should be informed by the above principles, but also by the relevant limitations."[22] See safe methods below.
 * HEAD : The HEAD method asks for a response identical to that of a GET request, but without the response body. This is useful for retrieving meta-information written in response headers, without having to transport the entire content.
 * POST : The POST method requests that the server accept the entity enclosed in the request as a new subordinate of the web resource identified by the URI. The data POSTed might be, for example, an annotation for existing resources; a message for a bulletin board, newsgroup, mailing list, or comment thread; a block of data that is the result of submitting a web form to a data-handling process; or an item to add to a database.[23]
 * PUT : The PUT method requests that the enclosed entity be stored under the supplied URI. If the URI refers to an already existing resource, it is modified; if the URI does not point to an existing resource, then the server can create the resource with that URI.[24]
 * DELETE : The DELETE method deletes the specified resource.
 * TRACE : The TRACE method echoes the received request so that a client can see what (if any) changes or additions have been made by intermediate servers.
 * OPTIONS : The OPTIONS method returns the HTTP methods that the server supports for the specified URL. This can be used to check the functionality of a web server by requesting '*' instead of a specific resource.
 * PATCH : The PATCH method applies partial modifications to a resource.
 *
 * @type { Router }
 */

const router = express.Router();
//create db
const db = require("../database/db");

/************************************** End Require module ****************************************************
 *****************************************************************************************************************/

/************************************** Start client router ****************************************************
 *****************************************************************************************************************/

router.get("/", (req, res) => {
  db.client
    .findAll({
      attributes: {
        include: [],
        exclude: [],
      },
    })
    // get list of clients All clients in your database
    .then((clients) => {
      if (clients) {
        // send back respose in json liste of clients
        res.status(200).json({ clients: clients });
      } else {
        res.status(404).json("client not found");
      }
    })
    // catch error if something happend
    .catch((err) => {
      // send back error
      res.json(err);
    });
});

router.post("/login", (req, res) => {
  db.client
    .findOne({
      where: { email: req.body.email },
    })
    .then((client) => {
      if (client) {
        if (bcrypt.compareSync(req.body.password, client.password)) {
          let clientdata = {
            nom: client.nom,
            prenom: client.prenom,
            email: client.email,
            tel: client.tel,
          };
          let token = jwt.sign(clientdata, process.env.SECRET_KEY, {
            expiresIn: 1440,
          });
          res.json({ token: token });
        } else {
          res.status(502).json("Wrong Email or password");
        }
      } else {
        res.status(404).json("client not found");
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

// add new client and voiture
router.post("/", (req, res) => {
  const clientdata = {
    nom: req.body.nom,
    prenom: req.body.prenom,
    email: req.body.email,
    tel: req.body.tel,
  };
  const marque = {
    marque: req.body.marque,
  };
  const cardata = {
    marqueId: null,
    modele: req.body.modele,
    type_moteur: req.body.type_moteur,
    numero_plaque: req.body.numero_plaque,
    annee: req.body.annee,
    couleur: req.body.couleur,
    clientId: 0,
  };

  db.client
    .findOne({
      where: { email: req.body.email },
    })
    .then((client) => {
      // if client is not in base so
      if (!client) {
        // we create new client add data "clientdata"
        db.client
          .create(clientdata)
          // send back data client
          .then((data) => {
            // now we try to find if marque in base
            cardata.clientId = data.id;
            db.marque
              .findOne({
                // where marque = marque
                where: { marque: req.body.marque },
              })
              .then((smarque) => {
                if (!smarque) {
                  db.marque
                    .create(marque)
                    .then((resmarque) => {
                      cardata.marqueId = resmarque.id;
                      db.voiture
                        .findOne({
                          where: { numero_plaque: cardata.numero_plaque },
                        })
                        .then((voiture) => {
                          if (!voiture) {
                            db.voiture
                              .create(cardata)
                              .then(() => {
                                db.client
                                  .findOne({
                                    include: [
                                      {
                                        // get voiture of clients
                                        model: db.voiture,
                                        include: [
                                          {
                                            model: db.marque,
                                          },
                                        ],
                                        attributes: {
                                          include: [],
                                          // don't need to show this filed
                                          exclude: [
                                            "clientId",
                                            "updated_at",
                                            "created_at",
                                          ],
                                        },
                                      },
                                    ],
                                    where: { id: cardata.clientId },
                                  })
                                  .then((reponse) => {
                                    res.json(reponse);
                                  });
                              })
                              .catch((err) => {
                                res.status(409).json(err);
                              });
                          }
                        })
                        .catch((err) => {
                          res.json(err);;
                        });
                    })
                    .catch((err) => {
                      res.status(409).json(err);
                    });
                } else {
                  cardata.marqueId = smarque.id;
                  db.voiture
                    .create(cardata)
                    .then(() => {
                      db.client
                        .findOne({
                          include: [
                            {
                              model: db.voiture,
                              through: { attributes: ["marqueId"] },
                            },
                          ],
                          where: { id: data.id },
                        })
                        .then((client) => {
                          res.status(200).json({ client: client });
                        })
                        .catch((err) => {
                          res.json(err);
                        });
                    })
                    .catch((err) => {
                      res.status(404).json(err + ("client cannot be found"));
                    });
                }
              })
              .catch((err) => {
                res.json(err);
              });
          })
          .catch((err) => {
            res.json(err);
          });
      }
    })
    .catch((err) => {
      res.status(404).json(err + ("client cannot be found"));
    });
});

// update client in params his id
//  exmple : localhost:{your port}/{you préfix}/{name_client}/{id }
router.put("/:id", (req, res) => {
  // find one client
  db.client
    .findOne({
      where: { id: req.params.id },
    })
    // if this clients allready in your database then update
    .then((client) => {
      if (client) {
        // make update client with body and id parmas
        client
          .update(
            {
              nom: req.body.nom,
              prenom: req.body.prenom,
              email: req.body.email,
              tel: req.body.tel,
            },
            {
              returning: true,
              plain: true,
            }
          )
          //
          .then((client) => {
            // then find this you upadate to get back new data of your clients with new data
            res.json(client);
          })
          .catch((err) => {
            res.json("error" + err);
          });
      } else {
        res.status(404).json("not found");
      }
    })
    .catch((err) => {
      res.json({
        error: "can't update client" + err,
      });
    });
});

router.delete("/:id", (req, res) => {
  db.client
    .findOne({
      where: { id: req.params.id },
    })
    .then((client) => {
      if (client) {
        client
          .destroy()
          .then(() => {
            res.json({ status: "client deleted" });
          })
          .catch((err) => {
            res.json({
              error: "error" + err,
            });
          });
      } else {
        res.json({
          error: "this client not existe in your base",
        });
      }
    })
    .catch((err) => {
      res.json({
        error: "error" + err,
      });
    });
});


module.exports = router;
