const { getWeb3ETHNoAccount } = require('../utils/web3');
const { request, gql } = require('graphql-request')
const { createData } = require('../utils')
const { AVAX_ADDRESS, ERC20ABI } = require('./avalancheconfig');
const BigNumber = require('bignumber.js')
const { getBalanceNumber, getBalanceAmount } = require('../utils/formatBalanceNumber')

const { GRAPH_API_UNISWAP } = require('../config')

const fetchAvaxPrice = async () => {
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
      { id: AVAX_ADDRESS.toLowerCase() },
    )
    return response.token.derivedETH * response.bundles[0].ethPrice
  }

async function getAvalancheReputation(address) {
    const web3 = getWeb3ETHNoAccount();
    let erc20contract = new web3.eth.Contract(ERC20ABI, AVAX_ADDRESS);
    let _balance = await erc20contract.methods.balanceOf(address).call();
    let balance = getBalanceNumber(new BigNumber(_balance), 18);
    let stakingInfo = []
    if (balance > 0) {
        let price = await fetchAvaxPrice();
        let balanceUSD = balance * price;
        stakingInfo.push(createData(AVAX_ADDRESS, "Avalanche Token", "AVAX", balance.toString(), balanceUSD.toString()));
    }
    return stakingInfo;
}

module.exports = { fetchAvaxPrice, getAvalancheReputation }