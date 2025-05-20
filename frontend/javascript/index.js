const socketConnection = new WebSocket('ws://localhost:8080');
const matchRegex = new RegExp(/(?<=_)[^_]+$/);
const isQualMatchRegex = new RegExp(/qm\d+$/);
const isPlayoffMatchRegex = new RegExp(/s?(f\d+m\d+)$/);

let bets = [];
let currentlySelectedBetType = "";
let currentlySelectedBetId = "";

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
        createMatchPanel(matchId);
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
            if(bets[i].type == "moneyline") {
                let firstBet = bets[i];
                let secondBet = bets[i + 1];
                let moneylineBlue = document.getElementById(matchId + "-moneyline-blue");
                let moneylineRed = document.getElementById(matchId + "-moneyline-red");
                moneylineBlue.onclick = function(event) {
                    selectBet(matchId, "moneyline-blue");
                }
                moneylineRed.onclick = function (event) {
                    selectBet(matchId, "moneyline-red");
                };
                moneylineRed.innerText = Math.round(firstBet.odds);
                moneylineBlue.innerText = Math.round(secondBet.odds);
                i++;
            } else if(bets[i].type == "total") {
                let firstBet = bets[i];
                let secondBet = bets[i + 1];
                let over = document.getElementById(matchId + "-over");
                let under = document.getElementById(matchId + "-under");
                over.onclick = function(event) {
                    selectBet(matchId, "total-over");
                }
                under.onclick = function (event) {
                    selectBet(matchId, "total-under");
                };
                over.innerHTML = "O " + secondBet.score + " (" + Math.round(secondBet.odds) + ")";
                under.innerText = "U " + firstBet.score + " (" + Math.round(firstBet.odds) + ")";
                i++;
            }
        }
    }
}

function createMatchPanel(match) {
    let matchSection = document.createElement("div");
    matchSection.setAttribute("class", "section");
    matchSection.setAttribute("id", match);
    let heading = document.createElement("h4");
    heading.innerText = getMatchTitle(match);
    matchSection.append(heading);
    let infoGrid = document.createElement("div");
    infoGrid.setAttribute("class", "info-grid");
    let allianceText = document.createElement("p");
    let moneylineText = document.createElement("p");
    let totalText = document.createElement("p");
    allianceText.innerText = "Alliance";
    moneylineText.innerText = "Moneyline";
    totalText.innerText = "Total";
    infoGrid.append(allianceText);
    infoGrid.append(moneylineText);
    infoGrid.append(totalText);
    let alliances = document.createElement("div");
    alliances.setAttribute("class", "alliances");
    alliances.innerHTML = 
    `
        <div class="red-alliance" id="${match}-red">
            <p>?</p>
            <p>?</p>
            <p>?</p>
        </div>
        <div class="blue-alliance" id="${match}-blue">
            <p>?</p>
            <p>?</p>
            <p>?</p>
        </div>
    `;
    infoGrid.append(alliances);
    let moneylineButtons = document.createElement("div");
    moneylineButtons.setAttribute("class", "button-selector");
    moneylineButtons.innerHTML = 
    `
        <button class="bet-button" id="${match}-moneyline-red">-200</button>
        <button class="bet-button" id="${match}-moneyline-blue">+200</button>
    `;
    infoGrid.append(moneylineButtons);
    let overUnderButtons = document.createElement("div");
    overUnderButtons.setAttribute("class", "button-selector");
    overUnderButtons.innerHTML = 
    `
        <button class="bet-button" id="${match}-over">O 100.5 (+110)</button>
        <button class="bet-button" id="${match}-under">U 100.5 (-110)</button>
    `;
    infoGrid.append(overUnderButtons);
    matchSection.append(infoGrid);
    document.getElementById("match-list").append(matchSection);
}

function getMatchTitle(matchId) {
    if (isQualMatchRegex.test(matchId)) {
        return "Qual " + matchId.slice(2);
    }
    if (isPlayoffMatchRegex.test(matchId)) {
        if (matchId.split("m")[0][0] == "s") { // Is semifinal
            return "Match " + matchId.split("m")[0].slice(2);
        } else {
            return "Final " + matchId.split("m")[1]
        }
    }
}
function selectBet(matchId, type) {
    let matchName = getMatchTitle(matchId);
    document.getElementById("bet-panel-title").innerText = matchName;
    if (type == "moneyline-red") {
        document.getElementById("bet-panel-type").innerText = "Moneyline - Red Alliance";
    } else if (type == "moneyline-blue") {
        document.getElementById("bet-panel-type").innerText = "Moneyline - Blue Alliance";
    } else if (type == "total-over") {
        document.getElementById("bet-panel-type").innerText = "Total - Over";
        
    } else if (type == "total-under") {
        document.getElementById("bet-panel-type").innerText = "Total - Under";
    }
    currentlySelectedBetId = matchId;
    currentlySelectedBetType = type;
}

function placeBet() {
    let amountBox = document.getElementById("bet-amount");
    let amount = parseInt(amountBox.value);
    if(isNaN(amount)) {
        return;
    }
    console.log(searchForBet(currentlySelectedBetId, currentlySelectedBetType));
    console.log("Placing this bet: " + currentlySelectedBetId + " " + currentlySelectedBetType + " " + amount);
}

function searchForBet(matchId, type) {
    let typeOfBet = type.split("-")[0];
    let targetOfBet = type.split("-")[1];
    let matchToSearch = null;
    let betMatch = null;
    bets.forEach( match => {
        if(match.matchid.split("_")[1] == matchId) {
            matchToSearch = match;
        }
    });
    if(matchToSearch != null) {
        matchToSearch.bets.forEach(bet => {
            if(typeOfBet == bet.type) {
                if(typeOfBet == "moneyline" && bet.alliance == targetOfBet) {
                    betMatch = bet;
                } else if(typeOfBet == "total" && (bet.over ? "over" : "under") == targetOfBet) {
                    betMatch = bet;
                }
            }
            
        });
    }
    return betMatch;
}