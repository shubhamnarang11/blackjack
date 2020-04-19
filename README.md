# BlackJack

This is a Card Game.

## Prerequisites

1. Make sure you have Node.js on your local machine.
   ```shell-script
   sudo apt-get install nodejs
   sudo apt-get install npm
   ```
2. You will need mongodb on your local machine.
   ```shell-script
       sudo apt-get install mongodb-org
   ```

## Run the Application

1. Install the dependecies

   ```shell-script
   npm install
   ```

2. Deploy the test data

   ```shell-script
   npm run migrate
   ```

3. Start the Application

   ```shell-script
   npm start
   ```

   In your browser, Open http://localhost:9090. You will see the app.

## API Definition

These all are Get APIs.

1. Start the Game

```shell-script
http://localhost:9090/blackjack/startGame
```

2. Dealer Play

```shell-script
http://localhost:9090/blackjack/dealerPlay/<gameId>
```

3. Player Hit

```shell-script
http://localhost:9090/blackjack/hitPlayer/<gameId>/<playerId>
```

4. Get Player History

```shell-script
http://localhost:9090/players/history/<playerId>
```