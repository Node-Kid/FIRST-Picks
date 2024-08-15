import { UUID } from "crypto";
import { Bet } from "./Bet";
import { Match } from "../misc/Match";
import { Outcome } from "../misc/Outcome";
import { getBetWinMultiplier } from "../misc/Util";
class MoneylineBet implements Bet {
    userid: string;
    match: Match;
    wager: number;
    odds: number;
    alliance: string;
    constructor(userid: UUID, match: Match, wager: number, odds: number, alliance: string) {
        this.userid = userid;
        this.match = match;
        this.wager = wager;
        this.odds = odds;
        this.alliance = alliance;
    }
    resolve(outcome: Outcome) {
        if(this.alliance == outcome.winner) {
            //award credit
            let totalReturn = this.wager + this.wager * getBetWinMultiplier(this.odds);

        }
    }
}

export { MoneylineBet }