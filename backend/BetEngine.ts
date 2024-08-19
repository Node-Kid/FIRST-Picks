import { Bet } from "./bets/Bet";
import axios from "axios";
import { MoneylineBet } from "./bets/MoneylineBet";
import { Match } from "./misc/Match";
import { generateOdds } from "./misc/Util";
import { TotalBet } from "./bets/TotalBet";
import { Parlay } from "./bets/Parlay";
class BetEngine {
    bets: Bet[];
    key: string;
    event: string;
    matches: {}[];
    static instance: BetEngine | undefined;
    constructor(tbaKey: string | undefined, event: string) {
        this.bets = [];
        this.key = tbaKey || '';
        this.event = event;
        this.matches = [];
        axios.get('https://www.thebluealliance.com/api/v3/event/' + this.event + '/matches', {
            headers: {
                'X-TBA-Auth-Key': this.key
            }
        })
            .then((response) => {
                this.matches = response.data;
        });
    }

    static getInstance(): BetEngine {
        if(this.instance == undefined) {
            this.instance = new BetEngine(process.env.TBA_APIKEY, '2024xxcha');
        }
        return this.instance;
    }

    generateBets(matchString: string) {

        axios.get('https://api.statbotics.io/v3/match/' + matchString)
            .then( (response) => {
                // redProbability = response.data.pred.red_win_prob;
                // blueProbability = 1 - redProbability;
                // predictedMatchWinner = response.data.pred.winner;
                let match: Match = {
                    redTeams: response.data.alliances.red,
                    blueTeams: response.data.alliances.blue,
                    matchid: matchString
                };
                console.log(response.data);
                let parlayBets: Bet[] = [];

                parlayBets.push(new MoneylineBet(match, 0, generateOdds(response.data.pred.red_win_prob), 'red'));
                parlayBets.push(new MoneylineBet(match, 0, generateOdds(1 - response.data.pred.red_win_prob), 'blue'));
                parlayBets.push(new TotalBet(match, 0, generateOdds(0.5), Math.floor(response.data.pred.red_score + response.data.pred.blue_score) + 0.5, false));
                parlayBets.push(new TotalBet(match, 0, generateOdds(0.5), Math.floor(response.data.pred.red_score + response.data.pred.blue_score) + 0.5, true));
                this.bets.push(new Parlay(parlayBets, [match], 0));
        }).catch(error => console.log(error));
        
    }

}

export { BetEngine }