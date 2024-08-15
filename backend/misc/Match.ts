class Match {
    redTeams: number[];
    blueTeams: number[];
    matchid: string;
    constructor(redTeams: number[], blueTeams: number[], matchid: string) {
        this.redTeams = redTeams;
        this.blueTeams = blueTeams;
        this.matchid = matchid;
    }
}

export { Match }