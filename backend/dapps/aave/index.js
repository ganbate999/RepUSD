const { getUserPools, getUserPolygonPools } = require('./helpers');
const { createData } = require('../utils')
const { getBalanceNumber, getBalanceAmount } = require('../utils/formatBalanceNumber')
const BigNumber = require('bignumber.js')

const fetchUserAAVEPoolInfo = async (address) => {
    let poolInfo = await getUserPools(address);
    return poolInfo;
}

const fetchUserAAVEPolygonPoolInfo = async(address) => {
    let poolInfo = await getUserPolygonPools(address);
    return poolInfo;
}

async function getAAVEReputation(address) {
    let rows = []
    let addresses = []
    let users = await fetchUserAAVEPoolInfo(address);
    if (users && users.length > 0) {
        let userPoolInfo = users[0].reserves;
        userPoolInfo.map((pool, index) => {
            if (pool.currentATokenBalance > 0) {
                let decimals = pool.reserve.decimals;
                let balance =  getBalanceNumber(new BigNumber(pool.currentATokenBalance), decimals);
                let symbol = pool.reserve.symbol;
                let address = pool.pool.id;
                let balanceUSD = balance * (getBalanceNumber(new BigNumber(pool.reserve.price.priceInEth), 18) * getBalanceNumber(new BigNumber(pool.reserve.price.oracle.usdPriceEth), 11));
                let index = addresses.indexOf(address);
                if (index == -1) {
                    addresses.push(address);
                    rows.push(createData(address, symbol + ' Pool', symbol, balance.toString(), balanceUSD.toString()));
                }
                else {
                    rows[index].balance = parseFloat(rows[index].balance) + balance;
                    rows[index].balanceUSD = parseFloat(rows[index].balanceUSD) + balanceUSD;
                }
            }
        })
    }
    let polygonUsers = await fetchUserAAVEPolygonPoolInfo(address);
    if (polygonUsers && polygonUsers.length > 0) {
        let polygonUserPoolInfo = polygonUsers[0].reserves;
        polygonUserPoolInfo.map((pool, index) => {
            if (pool.currentATokenBalance > 0) {
                let decimals = pool.reserve.decimals;
                let balance =  getBalanceNumber(new BigNumber(pool.currentATokenBalance), decimals);
                let symbol = pool.reserve.symbol;
                let address = pool.pool.id;
                let balanceUSD = balance * (getBalanceNumber(new BigNumber(pool.reserve.price.priceInEth), 18) * getBalanceNumber(new BigNumber(pool.reserve.price.oracle.usdPriceEth), 11));
                let index = addresses.indexOf(address);
                if (index == -1) {
                    addresses.push(address);
                    rows.push(createData(address, symbol + ' Pool', symbol, balance.toString(), balanceUSD.toString()));
                }
                else {
                    rows[index].balance = parseFloat(rows[index].balance) + balance;
                    rows[index].balanceUSD = parseFloat(rows[index].balanceUSD) + balanceUSD;
                }
            }
        })
    }
    return rows
}

module.exports = { getAAVEReputation, fetchUserAAVEPoolInfo, fetchUserAAVEPolygonPoolInfo };