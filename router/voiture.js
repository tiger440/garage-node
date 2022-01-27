const express = require("express"),
  router = express.Router(),
  db = require("../database/db"),
  randtoken = require("rand-token"),
  bcrypt = require("bcrypt"),
  nodemailer = require("nodemailer"),
  dotenv = require("dotenv");

dotenv.config();

router.post("/", (req, res) => {
  var token = randtoken.generate(16);
  const hash = bcrypt.hashSync(token, 10);
  const clientdata = {
    nom: req.body.nom,
    prenom: req.body.prenom,
    email: req.body.email,
    tel: req.body.tel,
    password: hash,
  };
  const marquedata = req.body.marque;
  const modeledata = req.body.modele;
  const anneedata = req.body.annee;
  const typemoteurdata = req.body.type_moteur;
  const cardata = {
    marqueId: null,
    numero_plaque: req.body.numero_plaque,
    couleur: req.body.couleur,
    clientId: null,
    modeleId: null,
    anneeId: null,
    typemoteurId: null,
  };
  db.client
    .findOne({
      where: { email: clientdata.email },
    })
    .then((client) => {
      if (client) {
        cardata.clientId = client.id;
        db.marque
          .findOne({ where: { marque: marquedata } })
          .then((marque) => {
            if (marque) {
              cardata.marqueId = marque.id;
              db.modele
                .findOne({
                  where: { modele: modeledata },
                })
                .then((modele) => {
                  if (modele) {
                    cardata.modeleId = modele.id;
                    db.annee
                      .findOne({ where: { annee: anneedata } })
                      .then((annee) => {
                        if (annee) {
                          cardata.anneeId = annee.id;
                          db.typemoteur
                            .findOne({
                              where: { type_moteur: typemoteurdata },
                            })
                            .then((typemoteur) => {
                              if (typemoteur) {
                                cardata.typemoteurId = typemoteur.id;
                                db.voiture
                                  .findOne({
                                    where: {
                                      numero_plaque: cardata.numero_plaque,
                                    },
                                  })
                                  .then((voiture) => {
                                    if (!voiture) {
                                      db.voiture
                                        .create(cardata)
                                        .then((voiture) => {
                                          db.voiture
                                            .findOne({
                                              where: { id: voiture.id },
                                              include: [
                                                { model: db.client },
                                                { model: db.marque },
                                                { model: db.typemoteur },
                                                { model: db.annee },
                                                { model: db.modele },
                                              ],
                                              /*  include: { all: true }, */
                                            })
                                            .then((car) => {
                                              res.json(car);
                                            })
                                            .catch((err) => {
                                              res.json(err);
                                            });
                                        })
                                        .catch((err) => {
                                          res.json(err);
                                        });
                                    } else {
                                      res.json("can not add voiture");
                                    }
                                  })
                                  .catch((err) => {
                                    res.json(err);
                                  });
                              } else {
                                db.typemoteur
                                  .create({ type_moteur: typemoteurdata })
                                  .then((typemoteur) => {
                                    cardata.typemoteurId = typemoteur.id;
                                    db.voiture
                                      .findOne({
                                        where: {
                                          numero_plaque: cardata.numero_plaque,
                                        },
                                      })
                                      .then((voiture) => {
                                        if (!voiture) {
                                          db.voiture
                                            .create(cardata)
                                            .then((voiture) => {
                                              res.json(voiture);
                                            })
                                            .catch((err) => {
                                              res.json(err);
                                            });
                                        } else {
                                          res.json("can not add voiture");
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
                              res.json(err);
                            });
                        } else {
                          db.annee
                            .create({ annee: anneedata })
                            .then((annee) => {
                              cardata.anneeId = annee.id;
                              db.typemoteur
                                .findOne({
                                  where: { type_moteur: typemoteurdata },
                                })
                                .then((typemoteur) => {
                                  if (typemoteur) {
                                    cardata.typemoteurId = typemoteur.id;
                                    db.voiture
                                      .findOne({
                                        where: {
                                          numero_plaque: cardata.numero_plaque,
                                        },
                                      })
                                      .then((voiture) => {
                                        if (!voiture) {
                                          db.voiture
                                            .create(cardata)
                                            .then((voiture) => {
                                              res.json(voiture);
                                            })
                                            .catch((err) => {
                                              res.json(err);
                                            });
                                        } else {
                                          res.json("can not add voiture");
                                        }
                                      })
                                      .catch((err) => {
                                        res.json(err);
                                      });
                                  } else {
                                    db.typemoteur
                                      .create({ type_moteur: typemoteurdata })
                                      .then((typemoteur) => {
                                        cardata.typemoteurId = typemoteur.id;
                                        db.voiture
                                          .findOne({
                                            where: {
                                              numero_plaque:
                                                cardata.numero_plaque,
                                            },
                                          })
                                          .then((voiture) => {
                                            if (!voiture) {
                                              db.voiture
                                                .create(cardata)
                                                .then((voiture) => {
                                                  res.json(voiture);
                                                })
                                                .catch((err) => {
                                                  res.json(err);
                                                });
                                            } else {
                                              res.json("can not add voiture");
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
                                  res.json(err);
                                });
                            })
                            .catch((err) => {
                              res.json(err);
                            });
                        }
                      })
                      .catch((err) => {
                        res.json(err);
                      });
                  } else {
                    // code here
                    // create modele
                    db.modele
                      .create({
                        modele: modeledata,
                        marqueId: marque.id,
                      })
                      .then((modele) => {
                        cardata.modeleId = modele.id;
                        db.annee
                          .findOne({ where: { annee: anneedata } })
                          .then((annee) => {
                            if (annee) {
                              cardata.anneeId = annee.id;
                              db.typemoteur
                                .findOne({ where: { typemoteur: typemoteur } })
                                .then((typemoteur) => {
                                  if (typemoteur) {
                                    cardata.typemoteurId = typemoteur.id;
                                    db.voiture
                                      .findOne({
                                        where: {
                                          numero_plaque: cardata.numero_plaque,
                                        },
                                      })
                                      .then((voiture) => {
                                        if (!voiture) {
                                          db.voiture
                                            .create(cardata)
                                            .then((car) => {
                                              res.json(car);
                                            })
                                            .catch((err) => {
                                              res.json(err);
                                            });
                                        } else {
                                          res.json("can't add voiture");
                                        }
                                      })
                                      .catch((err) => {
                                        res.json(err);
                                      });
                                  } else {
                                    db.typemoteur
                                      .create({
                                        type_moteur: typemoteurdata,
                                      })
                                      .then((typemoteur) => {
                                        cardata.typemoteurId = typemoteur.id;
                                        db.voiture
                                          .findOne({
                                            where: {
                                              numero_plaque:
                                                cardata.numero_plaque,
                                            },
                                          })
                                          .then((voiture) => {
                                            if (!voiture) {
                                              db.voiture
                                                .create(cardata)
                                                .then((voiture) => {
                                                  res.json(voiture);
                                                })
                                                .catch((err) => {
                                                  res.json(err);
                                                });
                                            } else {
                                              res.json("can't add voiture");
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
                                  res.json(err);
                                });
                            } else {
                              // code here if annee is not in db
                              db.annee
                                .create({
                                  annee: anneedata,
                                })
                                .then((annee) => {
                                  cardata.anneeId = annee.id;
                                  db.typemoteur
                                    .findOne({
                                      where: { typemoteur: typemoteur },
                                    })
                                    .then((typemoteur) => {
                                      // colle
                                      if (typemoteur) {
                                        cardata.typemoteurId = typemoteur.id;
                                        db.voiture
                                          .findOne({
                                            where: {
                                              numero_plaque:
                                                cardata.numero_plaque,
                                            },
                                          })
                                          .then((voiture) => {
                                            if (!voiture) {
                                              db.voiture
                                                .create(cardata)
                                                .then((car) => {
                                                  res.json(car);
                                                })
                                                .catch((err) => {
                                                  res.json(err);
                                                });
                                            } else {
                                              res.json("can't add voiture");
                                            }
                                          })
                                          .catch((err) => {
                                            res.json(err);
                                          });
                                      } else {
                                        db.typemoteur
                                          .create({
                                            type_moteur: typemoteurdata,
                                          })
                                          .then((typemoteur) => {
                                            cardata.typemoteurId =
                                              typemoteur.id;
                                            db.voiture
                                              .findOne({
                                                where: {
                                                  numero_plaque:
                                                    cardata.numero_plaque,
                                                },
                                              })
                                              .then((voiture) => {
                                                if (!voiture) {
                                                  db.voiture
                                                    .create(cardata)
                                                    .then((voiture) => {
                                                      res.json(voiture);
                                                    })
                                                    .catch((err) => {
                                                      res.json(err);
                                                    });
                                                } else {
                                                  res.json("can't add voiture");
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
                                      res.json(err);
                                    });
                                })
                                .catch((err) => {
                                  res.json(err);
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
                  res.json(err);
                });
            } else {
              db.marque
                .create({ marque: marquedata })
                .then((Marque) => {
                  cardata.marqueId = Marque.id;
                  db.modele
                    .create({ modele: modeledata, marqueId: Marque.id })
                    .then((modele) => {
                      cardata.modeleId = modele.id;
                      db.annee
                        .findOne({ where: { annee: anneedata } })
                        .then((annee) => {
                          if (annee) {
                            cardata.anneeId = annee.id;
                            db.typemoteur
                              .findOne({ type_moteur: typemoteurdata })
                              .then((typemoteur) => {
                                if (typemoteur) {
                                  cardata.typemoteurId = typemoteur.id;
                                  db.voiture
                                    .findOne({
                                      where: {
                                        numero_plaque: cardata.numero_plaque,
                                      },
                                    })
                                    .then((car) => {
                                      if (!car) {
                                        db.voiture
                                          .create(cardata)
                                          .then((voiture) => {
                                            res.json(voiture);
                                          })
                                          .catch((err) => {
                                            res.json(err);
                                          });
                                      } else {
                                        res.json("can't create voiture");
                                      }
                                    })
                                    .catch((err) => {
                                      res.json(err);
                                    });
                                } else {
                                  db.typemoteur
                                    .create({
                                      type_moteur: typemoteurdata,
                                    })
                                    .then((typemoteur) => {
                                      cardata.typemoteurId = typemoteur.id;
                                      db.voiture
                                        .findOne({
                                          where: {
                                            numero_plaque:
                                              cardata.numero_plaque,
                                          },
                                        })
                                        .then((car) => {
                                          if (!car) {
                                            db.voiture
                                              .create(cardata)
                                              .then((voiture) => {
                                                res.json(voiture);
                                              })
                                              .catch((err) => {
                                                res.json(err);
                                              });
                                          } else {
                                            res.json("can't create voiture");
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
                                res.json(err);
                              });
                          } else {
                            db.annee
                              .create({ annee: anneedata })
                              .then((annee) => {
                                cardata.anneeId = annee.id;
                                db.typemoteur
                                  .findOne({ type_moteur: typemoteurdata })
                                  .then((typemoteur) => {
                                    if (typemoteur) {
                                      cardata.typemoteurId = typemoteur.id;
                                      db.voiture
                                        .findOne({
                                          where: {
                                            numero_plaque:
                                              cardata.numero_plaque,
                                          },
                                        })
                                        .then((car) => {
                                          if (!car) {
                                            db.voiture
                                              .create(cardata)
                                              .then((voiture) => {
                                                res.json(voiture);
                                              })
                                              .catch((err) => {
                                                res.json(err);
                                              });
                                          } else {
                                            res.json("can't create voiture");
                                          }
                                        })
                                        .catch((err) => {
                                          res.json(err);
                                        });
                                    } else {
                                      db.typemoteur
                                        .create({
                                          type_moteur: typemoteurdata,
                                        })
                                        .then((typemoteur) => {
                                          cardata.typemoteurId = typemoteur.id;
                                          db.voiture
                                            .findOne({
                                              where: {
                                                numero_plaque:
                                                  cardata.numero_plaque,
                                              },
                                            })
                                            .then((car) => {
                                              if (!car) {
                                                db.voiture
                                                  .create(cardata)
                                                  .then((voiture) => {
                                                    res.json(voiture);
                                                  })
                                                  .catch((err) => {
                                                    res.json(err);
                                                  });
                                              } else {
                                                res.json(
                                                  "can't create voiture"
                                                );
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
                                    res.json(err);
                                  });
                              })
                              .catch((err) => {
                                res.json(err);
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
                })
                .catch((err) => {
                  res.json(err);
                });
            }
          })
          .catch((err) => {
            res.json(err);
          });
      } else {
        db.client
          .create(clientdata)
          .then((client) => {
            cardata.clientId = client.id;
            db.marque
              .findOne({ where: { marque: marquedata } })
              .then((marque) => {
                if (marque) {
                  cardata.marqueId = marque.id;
                  db.modele
                    .findOne({
                      where: { modele: modeledata },
                    })
                    .then((modele) => {
                      if (modele) {
                        cardata.modeleId = modele.id;
                        db.annee
                          .findOne({ where: { annee: anneedata } })
                          .then((annee) => {
                            if (annee) {
                              cardata.anneeId = annee.id;
                              db.typemoteur
                                .findOne({
                                  where: { type_moteur: typemoteurdata },
                                })
                                .then((typemoteur) => {
                                  if (typemoteur) {
                                    cardata.typemoteurId = typemoteur.id;
                                    db.voiture
                                      .findOne({
                                        where: {
                                          numero_plaque: cardata.numero_plaque,
                                        },
                                      })
                                      .then((voiture) => {
                                        if (!voiture) {
                                          db.voiture
                                            .create(cardata)
                                            .then((voiture) => {
                                              // send mail

                                              var transporter = nodemailer.createTransport(
                                                {
                                                  host: "smtp.gmail.com",
                                                  port: "587",
                                                  auth: {
                                                    user:
                                                      process.env.USER_EMAIL,
                                                    pass:
                                                      process.env.USER_PASSWORD,
                                                  },
                                                }
                                              );

                                              var mailOptions = {
                                                from: "process.env.USER_EMAIL",
                                                to: clientdata.email,
                                                subject:
                                                  "information pour la créeration du compte chez le garage",
                                                text:
                                                  "Voici votre email : " +
                                                  clientdata.email +
                                                  " et mot de passe : " +
                                                  token +
                                                  "les informations pour la connexion",
                                              };

                                              transporter.sendMail(
                                                mailOptions,
                                                (error, info) => {
                                                  if (error) {
                                                    console.log(error);
                                                    return res.json(error);
                                                  } else {
                                                    console.log(info);
                                                    return res.json(
                                                      info.reponse
                                                    );
                                                  }
                                                }
                                              );
                                            })
                                            .catch((err) => {
                                              res.json(err);
                                            });
                                        } else {
                                          res.json("can not add voiture");
                                        }
                                      })
                                      .catch((err) => {
                                        res.json(err);
                                      });
                                  } else {
                                    db.typemoteur
                                      .create({ type_moteur: typemoteurdata })
                                      .then((typemoteur) => {
                                        cardata.typemoteurId = typemoteur.id;
                                        db.voiture
                                          .findOne({
                                            where: {
                                              numero_plaque:
                                                cardata.numero_plaque,
                                            },
                                          })
                                          .then((voiture) => {
                                            if (!voiture) {
                                              db.voiture
                                                .create(cardata)
                                                .then((voiture) => {
                                                  res.json(voiture);
                                                })
                                                .catch((err) => {
                                                  res.json(err);
                                                });
                                            } else {
                                              res.json("can not add voiture");
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
                                  res.json(err);
                                });
                            } else {
                              db.annee
                                .create({ annee: anneedata })
                                .then((annee) => {
                                  cardata.anneeId = annee.id;
                                  db.typemoteur
                                    .findOne({
                                      where: { type_moteur: typemoteurdata },
                                    })
                                    .then((typemoteur) => {
                                      if (typemoteur) {
                                        cardata.typemoteurId = typemoteur.id;
                                        db.voiture
                                          .findOne({
                                            where: {
                                              numero_plaque:
                                                cardata.numero_plaque,
                                            },
                                          })
                                          .then((voiture) => {
                                            if (!voiture) {
                                              db.voiture
                                                .create(cardata)
                                                .then((voiture) => {
                                                  res.json(voiture);
                                                })
                                                .catch((err) => {
                                                  res.json(err);
                                                });
                                            } else {
                                              res.json("can not add voiture");
                                            }
                                          })
                                          .catch((err) => {
                                            res.json(err);
                                          });
                                      } else {
                                        db.typemoteur
                                          .create({
                                            type_moteur: typemoteurdata,
                                          })
                                          .then((typemoteur) => {
                                            cardata.typemoteurId =
                                              typemoteur.id;
                                            db.voiture
                                              .findOne({
                                                where: {
                                                  numero_plaque:
                                                    cardata.numero_plaque,
                                                },
                                              })
                                              .then((voiture) => {
                                                if (!voiture) {
                                                  db.voiture
                                                    .create(cardata)
                                                    .then((voiture) => {
                                                      res.json(voiture);
                                                    })
                                                    .catch((err) => {
                                                      res.json(err);
                                                    });
                                                } else {
                                                  res.json(
                                                    "can not add voiture"
                                                  );
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
                                      res.json(err);
                                    });
                                })
                                .catch((err) => {
                                  res.json(err);
                                });
                            }
                          })
                          .catch((err) => {
                            res.json(err);
                          });
                      } else {
                        // code here
                        // create modele
                        db.modele
                          .create({
                            modele: modeledata,
                            marqueId: marque.id,
                          })
                          .then((modele) => {
                            cardata.modeleId = modele.id;
                            db.annee
                              .findOne({ where: { annee: anneedata } })
                              .then((annee) => {
                                if (annee) {
                                  cardata.anneeId = annee.id;
                                  db.typemoteur
                                    .findOne({
                                      where: { typemoteur: typemoteur },
                                    })
                                    .then((typemoteur) => {
                                      if (typemoteur) {
                                        cardata.typemoteurId = typemoteur.id;
                                        db.voiture
                                          .findOne({
                                            where: {
                                              numero_plaque:
                                                cardata.numero_plaque,
                                            },
                                          })
                                          .then((voiture) => {
                                            if (!voiture) {
                                              db.voiture
                                                .create(cardata)
                                                .then((car) => {
                                                  res.json(car);
                                                })
                                                .catch((err) => {
                                                  res.json(err);
                                                });
                                            } else {
                                              res.json("can't add voiture");
                                            }
                                          })
                                          .catch((err) => {
                                            res.json(err);
                                          });
                                      } else {
                                        db.typemoteur
                                          .create({
                                            type_moteur: typemoteurdata,
                                          })
                                          .then((typemoteur) => {
                                            cardata.typemoteurId =
                                              typemoteur.id;
                                            db.voiture
                                              .findOne({
                                                where: {
                                                  numero_plaque:
                                                    cardata.numero_plaque,
                                                },
                                              })
                                              .then((voiture) => {
                                                if (!voiture) {
                                                  db.voiture
                                                    .create(cardata)
                                                    .then((voiture) => {
                                                      res.json(voiture);
                                                    })
                                                    .catch((err) => {
                                                      res.json(err);
                                                    });
                                                } else {
                                                  res.json("can't add voiture");
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
                                      res.json(err);
                                    });
                                } else {
                                  // code here if annee is not in db
                                  db.annee
                                    .create({
                                      annee: anneedata,
                                    })
                                    .then((annee) => {
                                      cardata.anneeId = annee.id;
                                      db.typemoteur
                                        .findOne({
                                          where: { typemoteur: typemoteur },
                                        })
                                        .then((typemoteur) => {
                                          // colle
                                          if (typemoteur) {
                                            cardata.typemoteurId =
                                              typemoteur.id;
                                            db.voiture
                                              .findOne({
                                                where: {
                                                  numero_plaque:
                                                    cardata.numero_plaque,
                                                },
                                              })
                                              .then((voiture) => {
                                                if (!voiture) {
                                                  db.voiture
                                                    .create(cardata)
                                                    .then((car) => {
                                                      res.json(car);
                                                    })
                                                    .catch((err) => {
                                                      res.json(err);
                                                    });
                                                } else {
                                                  res.json("can't add voiture");
                                                }
                                              })
                                              .catch((err) => {
                                                res.json(err);
                                              });
                                          } else {
                                            db.typemoteur
                                              .create({
                                                type_moteur: typemoteurdata,
                                              })
                                              .then((typemoteur) => {
                                                cardata.typemoteurId =
                                                  typemoteur.id;
                                                db.voiture
                                                  .findOne({
                                                    where: {
                                                      numero_plaque:
                                                        cardata.numero_plaque,
                                                    },
                                                  })
                                                  .then((voiture) => {
                                                    if (!voiture) {
                                                      db.voiture
                                                        .create(cardata)
                                                        .then((voiture) => {
                                                          res.json(voiture);
                                                        })
                                                        .catch((err) => {
                                                          res.json(err);
                                                        });
                                                    } else {
                                                      res.json(
                                                        "can't add voiture"
                                                      );
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
                                          res.json(err);
                                        });
                                    })
                                    .catch((err) => {
                                      res.json(err);
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
                      res.json(err);
                    });
                } else {
                  db.marque
                    .create({ marque: marquedata })
                    .then((Marque) => {
                      cardata.marqueId = Marque.id;
                      db.modele
                        .create({ modele: modeledata, marqueId: Marque.id })
                        .then((modele) => {
                          cardata.modeleId = modele.id;
                          db.annee
                            .findOne({ where: { annee: anneedata } })
                            .then((annee) => {
                              if (annee) {
                                db.typemoteur
                                  .findOne({ type_moteur: typemoteurdata })
                                  .then((typemoteur) => {
                                    if (typemoteur) {
                                      cardata.typemoteurId = typemoteur.id;
                                      db.voiture
                                        .findOne({
                                          where: {
                                            numero_plaque:
                                              cardata.numero_plaque,
                                          },
                                        })
                                        .then((car) => {
                                          if (!car) {
                                            db.voiture
                                              .create(cardata)
                                              .then((voiture) => {
                                                res.json(voiture);
                                              })
                                              .catch((err) => {
                                                res.json(err);
                                              });
                                          } else {
                                            res.json("can't create voiture");
                                          }
                                        })
                                        .catch((err) => {
                                          res.json(err);
                                        });
                                    } else {
                                      db.typemoteur
                                        .create({
                                          type_moteur: typemoteurdata,
                                        })
                                        .then((typemoteur) => {
                                          cardata.typemoteurId = typemoteur.id;
                                          db.voiture
                                            .findOne({
                                              where: {
                                                numero_plaque:
                                                  cardata.numero_plaque,
                                              },
                                            })
                                            .then((car) => {
                                              if (!car) {
                                                db.voiture
                                                  .create(cardata)
                                                  .then((voiture) => {
                                                    res.json(voiture);
                                                  })
                                                  .catch((err) => {
                                                    res.json(err);
                                                  });
                                              } else {
                                                res.json(
                                                  "can't create voiture"
                                                );
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
                                    res.json(err);
                                  });
                              } else {
                                db.annee
                                  .create({ annee: anneedata })
                                  .then((annee) => {
                                    cardata.anneeId = annee.id;
                                    db.typemoteur
                                      .findOne({ type_moteur: typemoteurdata })
                                      .then((typemoteur) => {
                                        if (typemoteur) {
                                          cardata.typemoteurId = typemoteur.id;
                                          db.voiture
                                            .findOne({
                                              where: {
                                                numero_plaque:
                                                  cardata.numero_plaque,
                                              },
                                            })
                                            .then((car) => {
                                              if (!car) {
                                                db.voiture
                                                  .create(cardata)
                                                  .then((voiture) => {
                                                    res.json(voiture);
                                                  })
                                                  .catch((err) => {
                                                    res.json(err);
                                                  });
                                              } else {
                                                res.json(
                                                  "can't create voiture"
                                                );
                                              }
                                            })
                                            .catch((err) => {
                                              res.json(err);
                                            });
                                        } else {
                                          db.typemoteur
                                            .create({
                                              type_moteur: typemoteurdata,
                                            })
                                            .then((typemoteur) => {
                                              cardata.typemoteurId =
                                                typemoteur.id;
                                              db.voiture
                                                .findOne({
                                                  where: {
                                                    numero_plaque:
                                                      cardata.numero_plaque,
                                                  },
                                                })
                                                .then((car) => {
                                                  if (!car) {
                                                    db.voiture
                                                      .create(cardata)
                                                      .then((voiture) => {
                                                        res.json(voiture);
                                                      })
                                                      .catch((err) => {
                                                        res.json(err);
                                                      });
                                                  } else {
                                                    res.json(
                                                      "can't create voiture"
                                                    );
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
                                        res.json(err);
                                      });
                                  })
                                  .catch((err) => {
                                    res.json(err);
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
                    })
                    .catch((err) => {
                      res.json(err);
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
      res.json(err);
    });
});

router.get("/:numero_plaque", (req, res) => {
  db.voiture
    .findOne({
      include: [
        {
          all: true,
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
        },
      ],
      attributes: {
        exclude: [
          "clientId",
          "marqueId",
          "created_at",
          "updated_at",
          "modeleId",
          "anneeId",
          "typemoteurId",
          ,
        ],
      },
      where: { numero_plaque: req.params.numero_plaque },
    })
    .then((voiture) => {
      if (voiture) {
        /* let cardata = {
          id: voiture.id,
          modele: voiture.modele,
          type_moteur: voiture.type_moteur,
          numero_plaque: voiture.numero_plaque,
          annee: voiture.annee,
          couleur: voiture.couleur,
          marque: voiture.tbl_marque.marque,

           clientId: voiture.tbl_client.id,
          client_nom: voiture.tbl_client.nom,
          client_prenom: voiture.tbl_client.prenom,
          client_email: voiture.tbl_client.email,
          client_tel: voiture.tbl_client.tel, 

           client: voiture.tbl_client,
        }; */
        res.json({
          voiture: voiture,
        });
      } else {
        res.json("not found");
      }
    });
});

module.exports = router;
