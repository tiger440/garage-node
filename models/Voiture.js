module.exports = (dbinfo, Sequelize) => {
  return dbinfo.define(
    // table name
    "tbl_voiture",
    {
      // field name
      id: {
        // set type data
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // field name
      numero_plaque: {
        // set data type
        type: Sequelize.DataTypes.STRING(10),
        // set unique
        unique: true,
        // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
        allowNull: false,
      },

      // field name
      couleur: {
        // set data type
        type: Sequelize.DataTypes.STRING(45),
        // setting allowNull to false will add NOT NULL to the column, which means an error will be if you add info in this column
        allowNull: false,
      },
    },
    {
      /**
       * By default, Sequelize will add the attributes createdAt and updatedAt to your model so you will be able to know when the database entry went into the db and when it was updated last.
       */
      timestamps: true,
      /**
       * Sequelize allow setting underscored option for Model. When true this option will set the field option on all attributes to the underscored version of its name.
       * This also applies to foreign keys generated by associations.
       * */

      underscored: true,
    }
  );
};
