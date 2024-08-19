import { Bet } from "./Bet";
import { Match } from "../misc/Match";
import { Outcome } from "../misc/Outcome";
import { getBetWinMultiplier } from "../misc/Util";
import { User } from "../users/User";
class MoneylineBet implements Bet {
    match: Match;
    wager: number;
    odds: number;
    alliance: string;

    constructor(match: Match, wager: number, odds: number, alliance: string) {
        this.match = match;
        this.wager = wager;
        this.odds = odds;
        this.alliance = alliance;
    }

    resolve(outcome: Outcome): boolean {
        return this.alliance == outcome.winner;
    }
}

export { MoneylineBet }