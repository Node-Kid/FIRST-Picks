import { UUID } from "crypto";
import { Bet } from "../bets/Bet";

class User {
    activeBets: Bet[];
    userid: string;
    tbaBucks: number;
    constructor(userid: UUID, tbaBucks: number) {
        this.userid = userid;
        this.tbaBucks = tbaBucks;
        this.activeBets = [];
    }
}

export { User }