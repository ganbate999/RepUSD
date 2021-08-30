const BigNumber = require('bignumber.js')
const { poolsConfig } = require('./pools');
const { fetchFarmUserStakedBalances } = require('./masterchef');
const { fetchUserStakeBalances, fetchTokenPrice } = require('./souschef');
const { createData } = require('../utils')
const { getBalanceNumber, getBalanceAmount } = require('../utils/formatBalanceNumber')

async function getPancakeswapReputation(address) {
    let rows = []
    let addresses = []
    let stakedResult = await fetchFarmUserStakedBalances(address);
    if (stakedResult && stakedResult.length > 0) {
        stakedResult.map((pool, index) => {
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
    }
    let stakedBalances = await fetchUserStakeBalances(address);
    let pool_len = poolsConfig.length;
    for (let i = 0; i < pool_len; i ++) {
        if (stakedBalances[poolsConfig[i].sousId] > 0) {
            const stakedBalance = new BigNumber(stakedBalances[poolsConfig[i].sousId]);
            const stakingToken = poolsConfig[i].stakingToken;
            const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken.decimals);
            const tokenPrice = await fetchTokenPrice(stakingToken.address['56'].toLowerCase());
            let balanceUSD = 0;
            if (tokenPrice.length > 0) {
                balanceUSD = tokenPrice[0].derivedUSD * parseFloat(stakedTokenBalance.toString());
            }
            rows.push(createData(poolsConfig[i].contractAddress['56'], poolsConfig[i].earningToken.symbol + ' Pool', poolsConfig[i].stakingToken.symbol, stakedTokenBalance.toString(), balanceUSD));
        }
    }
    return rows;
}

module.exports = { getPancakeswapReputation };