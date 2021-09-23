const { getUserPools, getUserPoolsV3 } = require('./helpers');
const { createData } = require('../utils')
const { getBalanceNumber, getBalanceAmount } = require('../utils/formatBalanceNumber')
const BigNumber = require('bignumber.js')

const fetchUserUniswapPoolInfo = async (address) => {
    let info = await getUserPools(address);
    return info;
}

const fetchUserUniswapV3PoolInfo = async (address) => {
    let info = await getUserPoolsV3(address);
    return info;
}

async function getUniswapReputation(address) {
    let rows = []
    let addresses = []
    let userPoolInfo = await fetchUserUniswapPoolInfo(address);
    if (userPoolInfo && userPoolInfo.length > 0) {
        let liquidityPositions = userPoolInfo[0].liquidityPositions;
        liquidityPositions.map((pool) => {
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
    let userV3PoolInfo = await fetchUserUniswapV3PoolInfo(address);
    if (userV3PoolInfo && userV3PoolInfo.length > 0) {
        userV3PoolInfo.map((pool) => {
            let balance = getBalanceNumber(new BigNumber(pool.liquidity), 18);
            let address = pool.pool.id;
            let depositedToken0 = parseFloat(pool.depositedToken0);
            let depositedToken1 = parseFloat(pool.depositedToken1);
            let token0Price = (parseFloat(pool.token0.volumeUSD) + parseFloat(pool.token0.untrackedVolumeUSD))/parseFloat(pool.token0.volume);
            let token1Price = (parseFloat(pool.token1.volumeUSD) + parseFloat(pool.token1.untrackedVolumeUSD))/parseFloat(pool.token1.volume);
            let pair = pool.token0.symbol + '/' + pool.token1.symbol;
            let balanceUSD = depositedToken0 * token0Price + depositedToken1 * token1Price;
            let index = addresses.indexOf(address);
            if (index == -1) {
                addresses.push(address);
                rows.push(createData(address, pair + ' Pool', pair + ' LP', balance.toString(), balanceUSD.toString()));
            }
            else {
                rows[index].balance = parseFloat(rows[index].balance) + balance;
                rows[index].balanceUSD = parseFloat(rows[index].balanceUSD) + balanceUSD;
            }
        })
    }
    return rows;
}

module.exports = { fetchUserUniswapPoolInfo, getUniswapReputation };