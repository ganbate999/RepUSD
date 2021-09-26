const { getWeb3ETHNoAccount } = require('../utils/web3');
const { request, gql } = require('graphql-request')
const { createData } = require('../utils')
const { WBTC_ADDRESS, ERC20ABI } = require('./wbtconfig');
const BigNumber = require('bignumber.js')
const { getBalanceNumber, getBalanceAmount } = require('../utils/formatBalanceNumber')

const { GRAPH_API_UNISWAP } = require('../config')

const fetchWBTCPrice = async () => {
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
      { id: WBTC_ADDRESS },
    )
    return response.token.derivedETH * response.bundles[0].ethPrice
  }

async function getWBTCReputation(address) {
    const web3 = getWeb3ETHNoAccount();
    let erc20contract = new web3.eth.Contract(ERC20ABI, WBTC_ADDRESS);
    let _balance = await erc20contract.methods.balanceOf(address).call();
    let balance = getBalanceNumber(new BigNumber(_balance), 8);
    let stakingInfo = []
    if (balance > 0) {
        let price = await fetchWBTCPrice();
        let balanceUSD = balance * price;
        stakingInfo.push(createData(WBTC_ADDRESS, "WBTC", "WBTC", balance.toString(), balanceUSD.toString()));
    }
    return stakingInfo;
}

module.exports = { fetchWBTCPrice, getWBTCReputation }