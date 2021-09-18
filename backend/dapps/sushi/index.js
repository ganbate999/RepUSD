const { getUserPools } = require('./helpers');
const { createData } = require('../utils')
const { getBalanceNumber } = require('../utils/formatBalanceNumber')
const BigNumber = require("bignumber.js");

const fetchUserSushiPoolInfo = async (address) => {
    let info = await getUserPools(address);
    return info;
}

async function getSushiReputation(address) {
    let userPoolInfo = await fetchUserSushiPoolInfo(address);
    if (!userPoolInfo || userPoolInfo.length <= 0) return [];
    let rows = []
    let addresses = []
    let userPooldata = userPoolInfo.liquidityPositions
    userPooldata.map((pool, index) => {
      if (pool.liquidityTokenBalance > 0) {
        let balance = pool.liquidityTokenBalance;
        let stakebalance = Number(balance).toFixed(3)
        let pair =pool.pair.name;
        let address= pool.pair.id;
        let symbol0 = pool.pair.token0.symbol;
        let symbol1 = pool.pair.token1.symbol;
        let USDAmount = pool.snapshots[0].reserveUSD;

        console.log(JSON.stringify(pool));

        let index = addresses.indexOf(address);
        if (index == -1) {
            addresses.push(address);
            rows.push(createData(address, pair, symbol0 +"-"+ symbol1 +' LP', stakebalance, USDAmount));
        }
        else {
            rows[index].balance = parseFloat(rows[index].balance) + parseFloat(stakebalance);
            rows[index].balanceUSD = parseFloat(rows[index].balanceUSD) + parseFloat(USDAmount);
        }
      }
    })
    return rows
}

module.exports = { fetchUserSushiPoolInfo, getSushiReputation };