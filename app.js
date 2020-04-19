const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const express = require("express");
const app = express();

const mongoose = require("mongoose");

const config = require("./utils/variables");

app.use(cors());

const players = require("./routes/players");
const blackjack = require("./routes/blackjack");

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

const port = process.env.PORT || config.port;
app.use(bodyParser.json());

// Directing Routes
app.use("/players", players);
app.use("/blackjack", blackjack);

app.use(express.static(path.join(__dirname, "public")));
// Port Number

// Index Route
app.get("/", (req, res) => {
  res.send("Web server not started");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Start Server
app.listen(port, () => {
  console.log("Server started on port " + port);
});
