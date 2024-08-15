import { UUID } from "crypto";
import { Match } from "../misc/Match";
import { Outcome } from "../misc/Outcome";

interface Bet {
    userid: string;
    match: Match;
    wager: number;
    odds: number;
    resolve(outcome: Outcome)

}

export { Bet }