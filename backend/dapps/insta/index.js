const { getUserPools } = require('./helpers.js');
const { createData } = require('../utils')
const { getBalanceNumber } = require('../utils/formatBalanceNumber')
const BigNumber = require("bignumber.js");

const fetchUserInstaPoolInfo = async (address) => {
    let info = await getUserPools(address);
    return info;
}

async function getInstaDappReputation(address) {
    let userPoolInfo = await fetchUserInstaPoolInfo(address);
    if (!userPoolInfo || userPoolInfo.length <= 0) return [];
    let rows = []
    let addresses = []
    userPoolInfo.map((pool, index) => {
        if (pool.balance > 0) {
            console.log(pool);
            let balance = pool.balance;
            let symbol = pool.symbol;
            let address = pool.address;
            let balanceUSD = pool.amountUSD;
            let index = addresses.indexOf(address);
            if (index == -1) {
                addresses.push(address);
                rows.push(createData(address, symbol + ' Pool', symbol, balance, balanceUSD));
            }
            else {
                rows[index].balance = parseFloat(rows[index].balance) + parseFloat(balance);
                rows[index].balanceUSD = parseFloat(rows[index].balanceUSD) + parseFloat(balanceUSD);
            }
        }
    })
    return rows
}

module.exports = { fetchUserInstaPoolInfo, getInstaDappReputation }