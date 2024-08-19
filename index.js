require('dotenv').config()
const app = require('express')();
const BetEngine = require('./backend/BetEngine').BetEngine;
const port = 80

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)

  BetEngine.getInstance().generateBets('2024mibel_qm1')
  console.log(BetEngine.getInstance().bets);
})