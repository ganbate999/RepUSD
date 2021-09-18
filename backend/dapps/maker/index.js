const { getUserPools } = require('./helpers');
const { createData } = require('../utils')
const { getBalanceNumber } = require('../utils/formatBalanceNumber')
const BigNumber = require("bignumber.js");

const fetchUserMakerPoolInfo = async (address) => {
    let info = await getUserPools(address);
    return info;
}

async function getMakerReputation(address) {
    let userPoolInfo = await fetchUserMakerPoolInfo(address);
    if (!userPoolInfo || userPoolInfo.length <= 0) return [];
    let rows = []
    let vaults = userPoolInfo[0].vaults;
    console.log(vaults)
    if (!vaults || vaults.length <= 0) return;
    let addresses = []
    vaults.map((pool, index) => {
      if (pool.collateral > 0) {
        let address = pool.id;
        let balance = pool.collateral;
        let symbol = pool.collateralType.id;
        let unitPrice = pool.collateralType.price.value;
        let amountUSD = new BigNumber(unitPrice).multipliedBy(balance);
        let index = addresses.indexOf(address);
        if (index == -1) {
            addresses.push(address);
            rows.push(createData(address, symbol + ' Pool', symbol, balance, amountUSD));
        }
        else {
            rows[index].balance = parseFloat(rows[index].balance) + parseFloat(balance);
            rows[index].balanceUSD = parseFloat(rows[index].balanceUSD) + parseFloat(amountUSD);
        }
      }
    })
    return rows
}

module.exports = { fetchUserMakerPoolInfo, getMakerReputation }