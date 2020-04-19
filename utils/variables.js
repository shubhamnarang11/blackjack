module.exports.database = {
  name: "mongodb://localhost:27017/blackjack",
  username: "",
  password: ""
};

module.exports.port = 9090;

module.exports.cards = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K"
];

module.exports.suits = ["Hearts", "Diamonds", "Clubs", "Spades"];

module.exports.cardValueDictionary = {
  A: 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  J: 10,
  Q: 10,
  K: 10
};
