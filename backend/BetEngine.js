"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetEngine = void 0;
var axios_1 = require("axios");
var MoneylineBet_1 = require("./bets/MoneylineBet");
var Util_1 = require("./misc/Util");
var BetEngine = /** @class */ (function () {
    function BetEngine(tbaKey, event) {
        var _this = this;
        this.bets = [];
        this.key = tbaKey || '';
        this.event = event;
        this.matches = [];
        axios_1.default.get('https://www.thebluealliance.com/api/v3/event/' + this.event + '/matches', {
            headers: {
                'X-TBA-Auth-Key': this.key
            }
        })
            .then(function (response) {
            _this.matches = response.data;
        });
    }
    BetEngine.getInstance = function () {
        if (this.instance == undefined) {
            this.instance = new BetEngine(process.env.TBA_APIKEY, '2024xxcha');
        }
        return this.instance;
    };
    BetEngine.prototype.generateBets = function (matchString) {
        var _this = this;
        axios_1.default.get('https://api.statbotics.io/v3/match/' + matchString)
            .then(function (response) {
            // redProbability = response.data.pred.red_win_prob;
            // blueProbability = 1 - redProbability;
            // predictedMatchWinner = response.data.pred.winner;
            var match = {
                redTeams: response.data.alliances.red,
                blueTeams: response.data.alliances.blue,
                matchid: matchString
            };
            console.log(response.data);
            _this.bets.push(new MoneylineBet_1.MoneylineBet(match, 0, (0, Util_1.generateOdds)(response.data.pred.red_win_prob), 'red'));
            _this.bets.push(new MoneylineBet_1.MoneylineBet(match, 0, (0, Util_1.generateOdds)(1 - response.data.pred.red_win_prob), 'blue'));
            console.log(_this.bets);
        }).catch(function (error) { return console.log(error); });
    };
    return BetEngine;
}());
exports.BetEngine = BetEngine;
