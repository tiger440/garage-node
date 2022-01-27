# garage-node

• run "npm install"

• run WampServer and create the MySQL database "db_garage"

• Go to database/db.js and un-comment line 196: "dbinfo.sync({ force: true });"

• Run "npm start" and it will synchronize the database

• If it don't work, don't forget to check the database informations in the ".env" file

• Don't forget to re-put "dbinfo.sync({ force: true });" as a comment once the DB is synchronized


POSTMAN was used to fill the database
