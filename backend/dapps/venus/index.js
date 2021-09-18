const { getUserPools } = require('./helper');
const { createData } = require('../utils')
const { getBalanceNumber } = require('../utils/formatBalanceNumber')
const BigNumber = require("bignumber.js");

const fetchUserVenusPoolInfo = async (address) => {
    let info = await getUserPools(address);
    // info = [{balance: "ad", symbol: 'aa', decimals:8, name : "aa"}];
    return info;
}

async function getVenusReputation(address) {
    let userPoolInfo = await fetchUserVenusPoolInfo(address);
    if (!userPoolInfo || userPoolInfo.length <= 0) return [];
    let rows = []
    let addresses = []
    if(userPoolInfo.length > 0){
        userPoolInfo.map((pooldata) =>{
            let address = pooldata.address;
            let balance = pooldata.balance;
            let symbol = pooldata.symbol;
            let name = pooldata.name + "POOL";
            let balanceUSD = pooldata.balanceUSD;
            let index = addresses.indexOf(address);
            if (index == -1) {
                addresses.push(address);
                rows.push(createData(address, name, symbol, balance, balanceUSD));
            }
            else {
                rows[index].balance = parseFloat(rows[index].balance) + parseFloat(balance);
                rows[index].balanceUSD = parseFloat(rows[index].balanceUSD) + parseFloat(balanceUSD);
            }
        })
      }
    return rows
}

module.exports = { fetchUserVenusPoolInfo, getVenusReputation };