const mongoose = require("mongoose");

// Players Schema
const PlayerSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  gameHistory: [
    {
      gameId: {
        type: String,
        required: true
      },
      cards: [{ card: { type: String }, suit: { type: String } }],
      status: {
        type: String,
        required: true,
        enum: ["ACTIVE", "WON", "LOST"]
      },

      gameStartTime: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

const Players = (module.exports = mongoose.model("Players", PlayerSchema));

module.exports.addPlayer = () => {
  return new Promise((resolves, reject) => {
    Players.find({}, (err, players) => {
      if (err) reject("Internal Server Error");
      console.log(err);
      
      const newPlayer = {
        id: players.length + 1,
        gameHistory: []
      };

      Players.create(newPlayer, err => {
        if (err) reject("Internal Server Error");
        resolves("Player has been added successfully!!!");
      });
    });
  });
};

module.exports.addPlayerToGame = (playerId, updatedGameHistory) => {
  return new Promise((resolves, reject) => {
    Players.findOneAndUpdate(
      { id: playerId },
      { gameHistory: updatedGameHistory },
      (err, res) => {
        if (err) reject("Game Id does not updated in Players database");
        resolves("Playes has been added to Game successfully!!!");
      }
    );
  });
};

module.exports.updateGameHistory = (winningCondition, lostCondition) => {
  return new Promise((resolves, reject) => {
    if (winningCondition != {}) {
      Players.update(
        winningCondition,
        { $set: { "gameHistory.$.status": "WON" } },
        err => {
          if (err) reject("Internal Server Error");
          resolves("Player status updated successfully");
        }
      );
    }
    if (lostCondition != {}) {
      Players.update(
        lostCondition,
        { $set: { "gameHistory.$.status": "LOST" } },
        err => {
          if (err) reject("Internal Server Error");
          resolves("All Players status has been successfully updated!!!");
        }
      );
    }
  });
};

module.exports.getPlayerHistory = playerId => {
  return new Promise((resolves, reject) => {
    Players.findOne({ id: playerId }, (err, player) => {
      if (err) reject("Player Not Found");
      resolves(player);
    });
  });
};
