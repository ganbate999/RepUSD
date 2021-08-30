const { getUserPools } = require('./helpers')
const { createData } = require('../utils')
const { getBalanceNumber, getBalanceAmount } = require('../utils/formatBalanceNumber')

const fetchUserCurvePoolInfo = async (address) => {
    let info = await getUserPools(address);
    return info;
}

async function getCurveReputation(address) {
    let rows = [];
    let userPoolInfo = await fetchUserCurvePoolInfo(address);
    if(userPoolInfo.length > 0){
        userPoolInfo.map((pooldata) =>{
            if(pooldata.balance >0) {
                let address = pooldata.address;
                let balance = pooldata.balance;
                let symbol = pooldata.symbol;
                let name = pooldata.name;
                let _decimals = pooldata.decimals;
                let _price = pooldata.price;
                let stakebalance = getBalanceNumber(balance, _decimals);
                rows.push(createData(address, name, symbol, stakebalance, parseFloat(stakebalance) * parseFloat(_price)))
            }
        })
    }
    return rows;
}

module.exports = { fetchUserCurvePoolInfo, getCurveReputation }