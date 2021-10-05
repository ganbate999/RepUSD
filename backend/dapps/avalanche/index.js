const { getWeb3AVAXNoAccount } = require('../utils/web3');
const { request, gql } = require('graphql-request')
const { createData } = require('../utils')
const { AVAX_ADDRESS } = require('./avalancheconfig');
const BigNumber = require('bignumber.js')
const { getBalanceNumber, getBalanceAmount } = require('../utils/formatBalanceNumber')

const { GRAPH_API_PANCAKESWAP } = require('../config')

const fetchAvaxPrice = async () => {
    const response = await request(
      GRAPH_API_PANCAKESWAP,
      gql`
        query Tokens($id: Bytes!){
          tokens(where: {id: $id}) {
            derivedUSD
          }
        }
    `,
      { id: AVAX_ADDRESS.toLowerCase() },
    )
    return parseFloat(response.tokens[0].derivedUSD);
  }

async function getAvalancheReputation(address) {
    const web3 = getWeb3AVAXNoAccount();
    let _balance = await web3.eth.getBalance(address);
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