import { Match } from "../misc/Match";
import { Outcome } from "../misc/Outcome";
import { Bet } from "./Bet";

class TotalBet implements Bet {
    type: string;
    match: Match;
    wager: number;
    odds: number;
    score: number;
    over: boolean;

    constructor(wager: number, odds: number, score: number, over: boolean) {
        this.type = "total";
        this.wager = wager;
        this.odds = odds;
        this.score = score;
        this.over = over;
    }

    resolve(outcome: Outcome): boolean {
        return this.over ? (outcome.blueScore + outcome.redScore) > this.score : (outcome.blueScore + outcome.redScore) < this.score;
    }

}
export { TotalBet }