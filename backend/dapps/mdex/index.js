const { getUserPools } = require('./helpers');
const { createData } = require('../utils')
const { getBalanceNumber } = require('../utils/formatBalanceNumber')
const BigNumber = require("bignumber.js");

const fetchUserMdexPoolInfo = async (address) => {
    let info = await getUserPools(address);
    return info;
}

async function getMdexReputation(address) {
    let userPoolInfo = await fetchUserMdexPoolInfo(address);
    let addresses = []
    if(userPoolInfo.length > 0){
        userPoolInfo.map((pooldata) =>{
            if(pooldata.balance >0) {
                let address = pooldata.address;
                let balance = pooldata.balance;
                let symbol = pooldata.symbol;
                let name = pooldata.name;
                let amountUSD = pooldata.amountUSD;
                let index = addresses.indexOf(address);
                if (index == -1) {
                    addresses.push(address);
                    rows.push(createData(address, name, symbol, balance, amountUSD));
                }
                else {
                    rows[index].balance = parseFloat(rows[index].balance) + parseFloat(balance);
                    rows[index].balanceUSD = parseFloat(rows[index].balanceUSD) + parseFloat(amountUSD);
                }
            }
        })
    }
    return rows;
}

module.exports = { fetchUserMdexPoolInfo, getMdexReputation }