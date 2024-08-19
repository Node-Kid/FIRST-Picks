import { UUID } from "crypto";
import { Match } from "../misc/Match";
import { Outcome } from "../misc/Outcome";
import { User } from "../users/User";

interface Bet {
    match: Match;
    wager: number;
    odds: number;
    resolve(outcome: Outcome): boolean
}

export { Bet }