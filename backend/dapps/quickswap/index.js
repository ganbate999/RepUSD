const { getUserPools } = require('./helpers');
const { createData } = require('../utils')
const { getBalanceNumber, getBalanceAmount } = require('../utils/formatBalanceNumber')
const BigNumber = require('bignumber.js')

const fetchUserQuickswapPoolInfo = async (address) => {
    let info = await getUserPools(address);
    return info;
}

async function getQuickswapReputation(address) {
    let rows = []
    let addresses = []
    let userPoolInfo = await fetchUserQuickswapPoolInfo(address);
    if (userPoolInfo && userPoolInfo.length > 0) {
        userPoolInfo.map((pool) => {
        if (pool.liquidityTokenBalance > 0) {
            let balance = pool.liquidityTokenBalance;
            let price = parseFloat(pool.pair.reserveUSD) / parseFloat(pool.pair.totalSupply);
            let balanceUSD = parseFloat(balance) * price;
            let address = pool.pair.id;
            let pair = pool.pair.token0.symbol + '/' + pool.pair.token1.symbol;
            let index = addresses.indexOf(address);
            if (index == -1) {
                addresses.push(address);
                rows.push(createData(address, pair + ' Pool', pair + ' LP', balance, balanceUSD.toString()));
            }
            else {
                rows[index].balance = parseFloat(rows[index].balance) + parseFloat(balance);
                rows[index].balanceUSD = parseFloat(rows[index].balanceUSD) + balanceUSD;
            }
        }
        })
    }
    
    return rows;
}

module.exports = { fetchUserQuickswapPoolInfo, getQuickswapReputation };