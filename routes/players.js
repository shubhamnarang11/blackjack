const express = require("express");
const router = express.Router();
const Players = require("../models/players");

router.post("/", async (req, res) => {
  const response = await Players.addPlayer();

  if (!response) {
    res.json({ success: false, msg: response });
  } else {
    res.json({ success: true, msg: response });
  }
});

router.get("/history/:playerId", (req, res) => {
  Players.getPlayerHistory(req.params.playerId)
    .then(history => {
      res.json({ success: true, msg: history });
    })
    .catch(err =>
      res.json({
        success: false,
        msg: "There is some error in getting player history."
      })
    );
});

module.exports = router;
