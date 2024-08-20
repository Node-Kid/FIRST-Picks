require('dotenv').config()
const app = require('express')();

app.use(require('express').static(__dirname + '/frontend'))

const BetEngine = require('./backend/BetEngine').BetEngine;
const port = 80
BetEngine.getInstance().generateBets('2024mibel_qm1')
app.get('/', (req, res) => {
  res.sendFile( __dirname + '/frontend/html/index.html');
})

app.get('/betEngine', (req, res) => {
  res.send(BetEngine.getInstance().bets);
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})