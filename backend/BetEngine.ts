import { Bet } from "./bets/Bet";
import axios from "axios";
import { MoneylineBet } from "./bets/MoneylineBet";
import { Match } from "./misc/Match";
import { generateOdds } from "./misc/Util";
import { TotalBet } from "./bets/TotalBet";
class BetEngine {
    private static qualMatchRegex: RegExp = new RegExp(/qm\d+$/);
    private static playoffMatchRegex: RegExp = new RegExp(/s?(f\d+m\d+)$/);
    bets: Match[];
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

    static getInstance(key: string): BetEngine {
        if(this.instance == undefined) {
            this.instance = new BetEngine(process.env.TBA_APIKEY, key);
        }
        return this.instance;
    }

    generateBets(matchString: string) {

        axios.get('https://api.statbotics.io/v3/match/' + matchString)
            .then( (response) => {
                // redProbability = response.data.pred.red_win_prob;
                // blueProbability = 1 - redProbability;
                // predictedMatchWinner = response.data.pred.winner;
                let betsForMatch: Bet[] = [];
                betsForMatch.push(new MoneylineBet(0, generateOdds(response.data.pred.red_win_prob), 'red'));
                betsForMatch.push(new MoneylineBet(0, generateOdds(1 - response.data.pred.red_win_prob), 'blue'));
                betsForMatch.push(new TotalBet(0, generateOdds(0.5), Math.floor(response.data.pred.red_score + response.data.pred.blue_score) + 0.5, false));
                betsForMatch.push(new TotalBet(0, generateOdds(0.5), Math.floor(response.data.pred.red_score + response.data.pred.blue_score) + 0.5, true));
                betsForMatch.push
                let match: Match = {
                    redTeams: response.data.alliances.red,
                    blueTeams: response.data.alliances.blue,
                    matchid: matchString,
                    bets: betsForMatch
                };
                this.bets.push(match);
                this.bets.sort(this.sortMatches);
                console.log(this.bets);
              
        }).catch(error => console.log(error));
    }
    private sortMatches(a: Match, b: Match) {
        if(BetEngine.qualMatchRegex.test(a.matchid) && BetEngine.qualMatchRegex.test(b.matchid)) { // both qual matches
            let matchA = BetEngine.qualMatchRegex.exec(a.matchid)?.[0].slice(2) as string; // slices qm off the number
            let matchB = BetEngine.qualMatchRegex.exec(b.matchid)?.[0].slice(2) as string;
            let idA = parseInt(matchA);
            let idB = parseInt(matchB);
            if (idA > idB) { // if match number of a is greater than b
                return 1;
            } else {
                return -1;
            }
        }
        if(BetEngine.playoffMatchRegex.test(a.matchid) && BetEngine.playoffMatchRegex.test(b.matchid)) { // both playoff matches
            let matchA = BetEngine.playoffMatchRegex.exec(a.matchid)?.[0].slice(2).split('m') as string[]; // splits the playoff number and match number (sf1m2 is split into [1, 2])
            let matchB = BetEngine.playoffMatchRegex.exec(b.matchid)?.[0].slice(2).split('m') as string[];
            if (parseInt(matchA[0]) > parseInt(matchB[0])) { // if playoff number of a is higher than b
                return 1;
            } else if (parseInt(matchA[0]) < parseInt(matchB[0])) {
                return -1;
            } else { // same playoff match, check match number;
                if (parseInt(matchA[1]) > parseInt(matchB[1])) {
                    return 1;
                } else {
                    return -1;
                }
            }
        }
        if (BetEngine.qualMatchRegex.test(a.matchid) && BetEngine.playoffMatchRegex.test(b.matchid)) { // if match a is qual and match b is playoff, rank a first
            return -1;
        } else { //match b is qual and match a is playoff
            return 1;
        }
    }
}

export { BetEngine }