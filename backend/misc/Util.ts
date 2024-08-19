
function getBetWinMultiplier(odds: number): number {
    return Math.sign(odds) == 1 ? odds / 100 : 100 / Math.abs(odds)
}

function generateOdds(probability: number): number {
    let p = probability + 0.0227 //how to earn profits 101
    return p >= 0.5 ? (100 * p) / (p - 1) : (100 / p ) - 100
}
export { getBetWinMultiplier, generateOdds }