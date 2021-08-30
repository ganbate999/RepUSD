const { getUserPools } = require('./helpers');
const { createData } = require('../utils')

const fetchUserUniswapPoolInfo = async (address) => {
    let info = await getUserPools(address);
    return info;
}

async function getUniswapReputation(address) {
    let userPoolInfo = await fetchUserUniswapPoolInfo(address);
    if (!userPoolInfo || userPoolInfo.length <= 0) return [];
    
    let rows = []
    let addresses = []
    userPoolInfo.map((pool, index) => {
    if (pool.liquidity > 0) {
        let balance = pool.liquidity;
        let balanceUSD = pool.amountUSD;
        let address = pool.pair.id;
        let pair = pool.pair.token0.symbol + '/' + pool.pair.token1.symbol;
        let index = addresses.indexOf(address);
        if (index == -1) {
            addresses.push(address);
            rows.push(createData(address, pair + ' Pool', pair + ' LP', balance, balanceUSD));
        }
        else {
            rows[index].balance = parseFloat(rows[index].balance) + parseFloat(balance);
            rows[index].balanceUSD = parseFloat(rows[index].balanceUSD) + parseFloat(balanceUSD);
        }
    }
    })
    return rows;
}

module.exports = { fetchUserUniswapPoolInfo, getUniswapReputation };