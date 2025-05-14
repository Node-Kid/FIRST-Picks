require('dotenv').config()
const app = require('express')();
const { WebSocketServer } = require('ws');
const webSocketServer = new WebSocketServer({ port: 8080 });
const BetEngine = require('./backend/BetEngine').BetEngine;
BetEngine.getInstance('2024mibel');
const port = 80;
BetEngine.getInstance().generateBets('2024mibel_qm1');

BetEngine.getInstance().generateBets('2024mibel_qm2');

// Express Code
app.use(require('express').static(__dirname + '/frontend'));

app.get('/', (req, res) => {
  res.sendFile( __dirname + '/frontend/html/index.html');
})

app.get('/betEngine', (req, res) => {
  res.send(BetEngine.getInstance().bets);
});


app.listen(port, () => {
  console.log(`Running on port ${port}`);
})

//Web Socket Code
webSocketServer.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    
  });
  ws.send(JSON.stringify(BetEngine.getInstance().bets));
})