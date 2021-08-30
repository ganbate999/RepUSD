const { getUserPools, getTokenPrice } = require('./helpers')
const { createData } = require('../utils')

const fetchUserCompoundPoolInfo = async (address) => {
    let info = await getUserPools(address);
    let result = [];
    if (info != null) {
        for (let i = 0; i < info.length; i ++) {
            let symbol = info[i].cTokenSymbol;
            let address = info[i].from;
            let price = await getTokenPrice(symbol);
            result.push({address: address, amount: info[i].amount, symbol: info[i].cTokenSymbol, price: price[0].underlyingPriceUSD * price[0].exchangeRate});
        }
    }
    return result;
}

async function getCompoundReputation(address) {
    let userPoolInfo = await fetchUserCompoundPoolInfo(address);
    if (!userPoolInfo || userPoolInfo.length <= 0) return [];
    let rows = []
    let addresses = []
    userPoolInfo.map((pool, index) => {
        if (pool.amount > 0) {
            let balance = pool.amount;
            let symbol = pool.symbol;
            let address = pool.address;
            let balanceUSD = parseFloat(balance) * parseFloat(pool.price);
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

module.exports = { fetchUserCompoundPoolInfo, getCompoundReputation }