const { getWeb3ETHNoAccount } = require('../utils/web3');
const { request, gql } = require('graphql-request')
const { createData } = require('../utils')
const { DAI_ADDRESS, ERC20ABI } = require('./daiconfig');
const BigNumber = require('bignumber.js')
const { getBalanceNumber, getBalanceAmount } = require('../utils/formatBalanceNumber')

const { GRAPH_API_UNISWAP } = require('../config')

const fetchDaiPrice = async () => {
    const response = await request(
      GRAPH_API_UNISWAP,
      gql`
        query Tokens($id: Bytes!){
          token(id: $id) {
                derivedETH
            }
          bundles {
              ethPrice
          }
        }
    `,
      { id: DAI_ADDRESS.toLowerCase() },
    )
    return response.token.derivedETH * response.bundles[0].ethPrice
  }

async function getDaiReputation(address) {
    const web3 = getWeb3ETHNoAccount();
    let erc20contract = new web3.eth.Contract(ERC20ABI, DAI_ADDRESS);
    let _balance = await erc20contract.methods.balanceOf(address).call();
    let balance = getBalanceNumber(new BigNumber(_balance), 18);
    let stakingInfo = []
    if (balance > 0) {
        let price = await fetchDaiPrice();
        let balanceUSD = balance * price;
        stakingInfo.push(createData(DAI_ADDRESS, "Dai Stablecoin", "DAI", balance.toString(), balanceUSD.toString()));
    }
    return stakingInfo;
}

module.exports = { fetchDaiPrice, getDaiReputation }