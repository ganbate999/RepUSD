const { getUserPools } = require('./helpers')
const { createData } = require('../utils')
const { getBalanceNumber } = require('../utils/formatBalanceNumber')
const { tokens } = require('../pancakeswap/tokens') 
const BigNumber = require("bignumber.js");

const fetchUserYearnPoolInfo = async (address) => {
    let info = await getUserPools(address);
    return info;
}

async function getYearnReputation(address) {
    let userPoolInfo = await fetchUserYearnPoolInfo(address);
    if (!userPoolInfo || userPoolInfo.length <= 0) return [];
    let rows = []
    let addresses = []
    userPoolInfo.map((pool, index) => {
        if (pool.balanceTokens > 0) {
          let token =pool.token;
          let address = pool.vault.id;
          let decimals = token.decimals;
          let balance = pool.balanceTokens;
          let stakebalance = getBalanceNumber(balance, decimals);
          let vaultDayData = pool.vault.vaultDayData;
          
          let amountUSD = 0;
          if (vaultDayData.length > 0)
            amountUSD = vaultDayData[vaultDayData.length - 1].tokenPriceUSDC;
          
          amountUSD = new BigNumber(amountUSD).div(
            new BigNumber(10).pow(tokens.usdc.decimals)
          ).multipliedBy(stakebalance);

          let name = token.name;
          let symbol = token.symbol

          let index = addresses.indexOf(address);
          if (index == -1) {
                addresses.push(address);
                rows.push(createData(address, name,  symbol, stakebalance.toFixed(3), amountUSD));
          }
          else {
              rows[index].balance = parseFloat(rows[index].balance) + parseFloat(stakebalance.toFixed(3));
              rows[index].balanceUSD = parseFloat(rows[index].balanceUSD) + parseFloat(amountUSD);
          }
        }
      })
    return rows
}

module.exports = { fetchUserYearnPoolInfo, getYearnReputation };