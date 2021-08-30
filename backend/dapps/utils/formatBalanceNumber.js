const BigNumber = require('bignumber.js')

const BIG_TEN = new BigNumber(10)

const getBalanceAmount = (amount, decimals = 18) => {
    return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals))
}

const getBalanceNumber = (balance, decimals = 18) => {
    return getBalanceAmount(balance, decimals).toNumber()
}

module.exports = { BIG_TEN, getBalanceAmount, getBalanceNumber }