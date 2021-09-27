const { getUserPools } = require('./helpers');
const { createData } = require('../utils')
const { getBalanceNumber, getBalanceAmount } = require('../utils/formatBalanceNumber')
const BigNumber = require('bignumber.js')

const fetchUserAlpacaPoolInfo = async (address) => {
    let poolInfo = await getUserPools(address);
    return poolInfo;
}

async function getAlpacaReputation(address) {
    let userPoolInfo = await fetchUserAlpacaPoolInfo(address);
    if (!userPoolInfo || userPoolInfo.length <= 0) return [];
    let rows = []
    let balance = getBalanceNumber(userPoolInfo[0].amount, 18);
    rows.push(createData('0xFE1622F9F594A113cd3C1A93F7F6B0d3C0588781', 'ibUSDT Pool', 'ibUSDT', balance.toString(), balance.toString()));
    return rows
}

module.exports = { fetchUserAlpacaPoolInfo, getAlpacaReputation };