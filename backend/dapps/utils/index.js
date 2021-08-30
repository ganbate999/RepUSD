function createData(poolAddress, poolName, symbol, balance, balanceUSD = 0) {
    return {poolAddress, poolName, symbol, balance, balanceUSD};
}

module.exports = { createData }