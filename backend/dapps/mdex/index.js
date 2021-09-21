const { getUserPools } = require('./helpers');
const { createData } = require('../utils')
const { getBalanceNumber } = require('../utils/formatBalanceNumber')
const BigNumber = require("bignumber.js");
const XHR = require('xhr2-cookies').XMLHttpRequest
XHR.prototype._onHttpRequestError = function (request, error) {
  if (this._request !== request) {
      return;
  }
  // A new line
  console.log(error, 'request')
  this._setError();
  request.abort();
  this._setReadyState(XHR.DONE);
  this._dispatchProgress('error');
  this._dispatchProgress('loadend');
};


const fetchUserMdexPoolInfo = async (address) => {
    let info = await getUserPools(address);
    return info;
}

async function getMdexReputation(address) {
    let userPoolInfo = await fetchUserMdexPoolInfo(address);
    let addresses = []
    let rows = []
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