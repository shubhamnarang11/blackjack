const express = require("express");
const router = express.Router();
const Blackjack = require("../models/blackjack");
const deckData = require("../utils/variables");
const Players = require("../models/players");

router.get("/startGame", (req, res) => {
  Blackjack.addGame()
    .then(gameId => {
      res.json({
        success: true,
        msg: `Game has been created successfully with game Id ${gameId}`
      });
    })
    .catch(err => res.json({ success: false, msg: err }));
});

router.get("/dealerPlay/:gameId", (req, res) => {
  Blackjack.dealerPlay(req.params.gameId)
    .then(dealerHandsValue => {
      if (dealerHandsValue > 21) {
        Blackjack.updateGameStatus(req.params.gameId).then(() => {
          res.json({ success: true, msg: "Dealer has lost this game." });
        });
      }
      res.json({ success: true, msg: "Let's start the next round" });
    })
    .catch(err => res.json({ success: false, msg: err }));
});

router.get("/hitPlayer/:gameId/:playerId", (req, res) => {
  Blackjack.getCard(req.params.gameId, req.params.playerId)
    .then(({ currentPlayer, dealerHands }) => {
      let playerHandResult = 0,
        dealerHandResult = 0;
      currentPlayer.cards.forEach(playerHand => {
        playerHandResult += deckData.cardValueDictionary[playerHand.card];
      });

      dealerHands.forEach(dealerHand => {
        dealerHandResult += deckData.cardValueDictionary[dealerHand.card];
      });
      if (playerHandResult > dealerHandResult || playerHandResult == 21) {
        Players.updateGameHistory(
          { id: req.params.playerId, "gameHistory.gameId": req.params.gameId },
          {}
        )
          .then(() => res.json({ success: true, msg: "Player has WON!!!" }))
          .catch(err => res.json({ success: false, msg: err }));
      } else if (playerHandResult > 21) {
        Players.updateGameHistory(
          {},
          { id: req.params.playerId, "gameHistory.gameId": req.params.gameId }
        )
          .then(() => res.json({ success: true, msg: "Player has LOST!!!" }))
          .catch(err => res.json({ success: false, msg: err }));
      } else {
        res.json({ success: true, msg: "Turn for next player." });
      }
    })
    .catch(err => res.json({ success: false, msg: err }));
});
module.exports = router;
