const mongoose = require("mongoose");
const uniqid = require("uniqid");
const helper = require("./gameHelper");
const Players = require("./players");

// Blackjack Game Schema
const GameSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  currentDeck: [{ card: { type: String }, suit: { type: String } }],
  dealerHands: [{ card: { type: String }, suit: { type: String } }],
  playerHands: [
    {
      playerId: { type: String, required: true },
      cards: [{ card: { type: String }, suit: { type: String } }]
    }
  ],
  gameTime: { type: Date, default: Date.now },
  status: {
    type: String,
    default: "ACTIVE",
    enum: ["ACTIVE", "FINISHED"]
  }
});

const Game = (module.exports = mongoose.model("Game", GameSchema));

module.exports.addGame = () => {
  const deck = helper.createDeck(3);
  const shuffledDeck = helper.shuffleDeck(deck);

  const gameId = uniqid();
  return new Promise((resolves, reject) => {
    Players.find({}, async (err, players) => {
      if (err) reject("Internal Server Error");

      const {
        playerHands,
        dealerHands,
        currentDeck
      } = helper.initializePlayers(players, shuffledDeck);

      await players.forEach(async (player, index) => {
        await Players.addPlayerToGame(player.id, [
          ...player.gameHistory,
          { gameId, cards: playerHands[index].cards, status: "ACTIVE" }
        ]);
      });

      Game.create(
        { id: gameId, currentDeck, dealerHands, playerHands },
        err => {
          if (err) reject("There is some problem while creating new Game");
          resolves(gameId);
        }
      );
    });
  });
};

module.exports.dealerPlay = gameId => {
  return new Promise((resolves, reject) => {
    Game.findOne({ id: gameId }, (err, game) => {
      if (err) reject("Internal Server Error");
      if (game.status == "FINISHED") reject("Game has Finished!!!");

      const response = helper.dealerPlay(game.currentDeck, game.dealerHands);

      let update = {
        dealerHands: response.dealerHands,
        currentDeck: response.deck
      };

      Game.findOneAndUpdate({ id: gameId }, update, err => {
        if (err) reject("There is some problem in updation");
        resolves(response.result);
      });
    });
  });
};

module.exports.updateGameStatus = gameId => {
  return new Promise((resolves, reject) => {
    Game.findOneAndUpdate({ id: gameId }, { status: "FINISHED" }, err => {
      if (err) reject("Error while updating game status");
      Players.updateGameHistory({ "gameHistory.gameId": gameId }, gameId).then(
        () => {
          resolves();
        }
      );
    });
  });
};

module.exports.getCard = (gameId, playerId) => {
  return new Promise((resolves, reject) => {
    Game.findOne({ id: gameId }, (err, game) => {
      if (err) reject("Internal Server Error");
      const card = game.currentDeck.pop();
      const playerHands = game.playerHands;
      let currentPlayer;

      playerHands.forEach((playerHand, index) => {
        if (playerHand.playerId == playerId) {
          playerHands[index].cards.push(card);
          currentPlayer = playerHands[index];
        }
      });

      Game.findOneAndUpdate(
        { id: gameId },
        { playerHands, currentDeck: game.currentDeck },
        err => {
          if (err) reject("Error while updating player hands");
          resolves({ currentPlayer, dealerHands: game.dealerHands });
        }
      );
    });
  });
};
