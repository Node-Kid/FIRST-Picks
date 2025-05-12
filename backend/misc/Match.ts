import { Bet } from "../bets/Bet";

type Match = {
    redTeams: number[];
    blueTeams: number[];
    matchid: string;
    bets: Bet[];
}

export { Match }