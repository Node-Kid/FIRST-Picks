
function getBetWinMultiplier(odds: number) {
    return Math.sign(odds) == 1 ? odds / 100 : 100 / Math.abs(odds)
}

export {getBetWinMultiplier}