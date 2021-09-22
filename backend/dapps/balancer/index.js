const { getUserPools } = require('./helpers');
const { createData } = require('../utils')

const fetchUserBalancerPoolInfo = async (address) => {
    let poolInfo = await getUserPools(address);
    return poolInfo;
}

async function getBalancerReputation(address) {
    let userPoolInfo = await fetchUserBalancerPoolInfo(address);
    if (!userPoolInfo || userPoolInfo.length <= 0) return [];
    let rows = []
    let addresses = []
    userPoolInfo.map((pool, index) => {
        if (pool.balance > 0) {
            let balance = pool.balance;
            let symbol = pool.poolId.symbol;
            let address = pool.poolId.address;
            let balanceUSD = parseFloat(balance) * (parseFloat(pool.poolId.totalLiquidity) / parseFloat(pool.poolId.totalShares));
            let index = addresses.indexOf(address);
            if (index == -1) {
                addresses.push(address);
                rows.push(createData(address, symbol + ' Pool', symbol, balance, balanceUSD.toString()));
            }
            else {
                rows[index].balance = parseFloat(rows[index].balance) + parseFloat(balance);
                rows[index].balanceUSD = parseFloat(rows[index].balanceUSD) + balanceUSD;
            }
        }
    })
    return rows
}

module.exports = { getBalancerReputation, fetchUserBalancerPoolInfo };