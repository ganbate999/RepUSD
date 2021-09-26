const { getWeb3BSCNoAccount } = require('../utils/web3');
const { API_ELLIPSIS, ELLIPSIS_ERC20ABI } = require('./ellipsisconfig');
const { createData } = require('../utils')
const BigNumber = require('bignumber.js')
const { getBalanceNumber, getBalanceAmount } = require('../utils/formatBalanceNumber')
const fetch = require('node-fetch');

const getEllipsisPools = async(address) => {
    let stakingInfo = []
    let res = await fetch(API_ELLIPSIS);
    let result = await res.json();
    let basePools = result.data.basePools;
    let metaPools = result.data.metaPools;
    const web3 = getWeb3BSCNoAccount();

    for(let j = 0; j < basePools.length; j ++) {
      let price = getBalanceNumber(new BigNumber(basePools[j].virtualPrice), 18);
      let lpAddress = basePools[j].lpToken.address;
      let lpSymbol = basePools[j].lpToken.symbol;
      let lpDecimals = basePools[j].lpToken.decimals;
      let erc20contract = new web3.eth.Contract(ELLIPSIS_ERC20ABI, lpAddress);
      let _balance = await erc20contract.methods.balanceOf(address).call();
      let balance = getBalanceNumber(new BigNumber(_balance), lpDecimals)      
      if (balance > 0) {
          let balanceUSD = balance * price;
          stakingInfo.push(createData(lpAddress, lpSymbol+' Pool', lpSymbol, balance.toString(), balanceUSD.toString() ));
      }
    }

    for(let j = 0; j < metaPools.length; j ++) {
        let price = getBalanceNumber(new BigNumber(metaPools[j].virtualPrice), 18);
        let lpAddress = metaPools[j].lpToken.address;
        let lpSymbol = metaPools[j].lpToken.symbol;
        let lpDecimals = metaPools[j].lpToken.decimals;
        let erc20contract = new web3.eth.Contract(ELLIPSIS_ERC20ABI, lpAddress);
        let _balance = await erc20contract.methods.balanceOf(address).call();
        let balance = getBalanceNumber(new BigNumber(_balance), lpDecimals)      
        if (balance > 0) {
            let balanceUSD = balance * price;
            stakingInfo.push(createData(lpAddress, lpSymbol+' Pool', lpSymbol, balance.toString(), balanceUSD.toString() ));
        }
    }
    return stakingInfo;
  }

module.exports = { getEllipsisPools }