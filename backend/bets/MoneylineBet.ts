import { Bet } from "./Bet";
import { Match } from "../misc/Match";
import { Outcome } from "../misc/Outcome";
import { getBetWinMultiplier } from "../misc/Util";
import { User } from "../users/User";
class MoneylineBet implements Bet {
    user: User;
    match: Match;
    wager: number;
    odds: number;
    alliance: string;
    constructor(user: User, match: Match, wager: number, odds: number, alliance: string) {
        this.user = user;
        this.match = match;
        this.wager = wager;
        this.odds = odds;
        this.alliance = alliance;
    }
    resolve(outcome: Outcome): boolean {
        if(this.alliance == outcome.winner) {
            let totalReturn = this.wager + this.wager * getBetWinMultiplier(this.odds);
            this.user.tbaBucks += totalReturn;  //award credit
            return true;
        } else {
            return false;
        }
    }
}

export { MoneylineBet }