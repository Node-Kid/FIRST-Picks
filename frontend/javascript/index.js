const socketConnection = new WebSocket('ws://localhost:8080');
const matchRegex = new RegExp(/(?<=_)[^_]+$/);
let bets = [];
socketConnection.addEventListener('open', (event) => {
    socketConnection.send(JSON.stringify({hello: 2}));
});
socketConnection.addEventListener('message', (message) => {
    bets = JSON.parse(message.data);
    console.log(bets);
    loadBets(bets);
});

function loadBets(betsToBeLoaded) {
    for(let j = 0; j < betsToBeLoaded.length; j++) {
        let match = betsToBeLoaded[j];
        let matchId = match.matchid.match(matchRegex)[0];
        document.getElementById(matchId + "-red").innerHTML = `
            <p>${match.redTeams.team_keys[0]}</p>
            <p>${match.redTeams.team_keys[1]}</p>
            <p>${match.redTeams.team_keys[2]}</p>
            `;
        document.getElementById(matchId + "-blue").innerHTML = `
            <p>${match.blueTeams.team_keys[0]}</p>
            <p>${match.blueTeams.team_keys[1]}</p>
            <p>${match.blueTeams.team_keys[2]}</p>
            `;
        let bets = betsToBeLoaded[j].bets;
        for(let i = 0; i < bets.length; i++) {
            
            console.log(bets[i]);
            if(bets[i].type == "moneyline") {
                let firstBet = bets[i];
                let secondBet = bets[i + 1];
                let moneylineBlue = document.getElementById(matchId + "-moneyline-blue");
                let moneylineRed = document.getElementById(matchId + "-moneyline-red");
                moneylineRed.innerText = Math.round(firstBet.odds);
                moneylineBlue.innerText = Math.round(secondBet.odds);
                i++;
            } else if(bets[i].type == "total") {
                let firstBet = bets[i];
                let secondBet = bets[i + 1];
                let over = document.getElementById(matchId + "-over");
                let under = document.getElementById(matchId + "-under");
                over.innerHTML = "U " + secondBet.score + " (" + Math.round(secondBet.odds) + ")";
                under.innerText = "O " + firstBet.score + " (" + Math.round(firstBet.odds) + ")";
                i++;
            }
        }
    }
}