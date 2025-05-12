import { Match } from "../misc/Match";
import { Outcome } from "../misc/Outcome";
import { getBetWinMultiplier } from "../misc/Util";
import { Bet } from "./Bet";

class Parlay implements Bet {
    type: string;
    bets: Bet[];
    matches: Match[];
    wager: number;
    odds: number;

    constructor(bets: Bet[], matches: Match[], wager: number) {
        this.type = "parlay";
        this.bets = bets;
        this.matches = matches;
        this.wager = wager;
        this.odds = bets.reduce((acc, current) => acc * (getBetWinMultiplier(current.odds) + 1), 1);
        this.odds = (100 * this.odds); //go from multiplier to american odds
    }
    
    

    resolve(outcome: Outcome): boolean {
        return this.bets.every(bet => bet.resolve(outcome) == true);
    }
}

export { Parlay }