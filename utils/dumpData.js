const mongoose = require("mongoose");

const config = require("./variables");
const Players = require("../models/players");

// Connect To Database
mongoose.connect(config.database.name, { useNewUrlParser: true });

// On Connection
mongoose.connection.on("connected", () => {
  console.log("Connected to database " + config.database.name);
});

// On Error
mongoose.connection.on("error", err => {
  console.log("Database error:\n" + err);
});

Players.addPlayer()
  .then(() => {
    Players.addPlayer()
      .then(() => {
        Players.addPlayer()
          .then(() => {
            console.log("Players database has been dumped");
          })
          .catch(() => {
            console.log("There is some problem while dumping the data");
          });
      })
      .catch(() => {
        console.log("There is some problem while dumping the data");
      });
  })
  .catch(() => {
    console.log("There is some problem while dumping the data");
  });
