const { getWeb3ETHNoAccount } = require('../utils/web3');
const { request, gql } = require('graphql-request')
const { createData } = require('../utils')
const { TERRA_ADDRESS, ERC20ABI } = require('./terraconfig');
const BigNumber = require('bignumber.js')
const { getBalanceNumber, getBalanceAmount } = require('../utils/formatBalanceNumber')

const { GRAPH_API_UNISWAP } = require('../config')

const fetchTerraPrice = async () => {
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
      { id: TERRA_ADDRESS.toLowerCase() },
    )
    return response.token.derivedETH * response.bundles[0].ethPrice
  }

async function getTerraReputation(address) {
    const web3 = getWeb3ETHNoAccount();
    let erc20contract = new web3.eth.Contract(ERC20ABI, TERRA_ADDRESS);
    let _balance = await erc20contract.methods.balanceOf(address).call();
    let balance = getBalanceNumber(new BigNumber(_balance), 18);
    let stakingInfo = []
    if (balance > 0) {
        let price = await fetchTerraPrice();
        let balanceUSD = balance * price;
        stakingInfo.push(createData(TERRA_ADDRESS, "Wrapped LUNA Token", "LUNA", balance.toString(), balanceUSD.toString()));
    }
    return stakingInfo;
}

module.exports = { fetchTerraPrice, getTerraReputation }