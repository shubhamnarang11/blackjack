const deckData = require("../utils/variables");

const createDeck = noOfDecks => {
  const deck = [];

  for (let d = 0; d < noOfDecks; d++) {
    for (let c = 0; c < deckData.cards.length; c++) {
      for (let s = 0; s < deckData.suits.length; s++) {
        deck.push({ card: deckData.cards[c], suit: deckData.suits[s] });
      }
    }
  }

  return deck;
};

const shuffleDeck = deck => {
  for (
    let j, k, i = deck.length;
    i;
    j = parseInt(Math.random() * i),
      k = deck[--i],
      deck[i] = deck[j],
      deck[j] = k
  );
  return deck;
};

const initializePlayers = (players, deck) => {
  const playersId = players.map(player => player.id);
  let initializedPlayer = [];
  const initializedDealer = [];

  for (let i = 0; i < 2; i++) {
    for (let x = 0; x < playersId.length; x++) {
      const card = deck.pop();
      if (!initializedPlayer[x]) {
        initializedPlayer[x] = {
          playerId: playersId[x],
          cards: [card]
        };
      } else {
        initializedPlayer[x].cards.push(card);
      }
    }
    initializedDealer.push(deck.pop());
  }

  return {
    playerHands: initializedPlayer,
    dealerHands: initializedDealer,
    currentDeck: deck
  };
};

const dealerPlay = (deck, dealerHands) => {
  var result = 0;
  var isAce = false;

  dealerHands.forEach(dealerHand => {
    result += deckData.cardValueDictionary[dealerHand.card];
  });

  var hand = deck.pop();
  
  dealerHands.push(hand);
  if (hand.card == "A") {
    result += 1;
    isAce = true;
  } else result += deckData.cardValueDictionary[hand.card];

  if (isAce && result + 10 <= 21) result + 10;

  return { result, dealerHands, deck };
};

module.exports = { createDeck, shuffleDeck, initializePlayers, dealerPlay };
