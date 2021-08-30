const BigNumber = require('bignumber.js')
const { multicall } = require('../../utils/multicall')
const { poolsConfig } = require('../pools')
const { souschefABI } = require('../../../abi/pancakeswap/sousChef')
const { masterchefContractAddress } = require('../../config');
const { masterchefABI } = require('../../../abi/pancakeswap/masterchef');
const { getWeb3BSCNoAccount } = require('../../utils/web3');
const { request, gql } = require('graphql-request');
const { GRAPH_API_PANCAKESWAP } = require('../../config');

const fetchUserStakeBalances = async (account) => {
    const nonMasterPools = poolsConfig.filter((p) => p.sousId !== 0)
    const web3 =await getWeb3BSCNoAccount()
    const masterChefContract = new web3.eth.Contract(masterchefABI, masterchefContractAddress)
    const calls = nonMasterPools.map((p) => ({
      address: p.contractAddress['56'],
      name: 'userInfo',
      params: [account],
    }))
    const userInfo = await multicall(souschefABI, calls)
    const stakedBalances = nonMasterPools.reduce(
      (acc, pool, index) => ({
        ...acc,
        [pool.sousId]: new BigNumber(userInfo[index].amount._hex).toJSON(),
      }),
      {},
    )
  
    // Cake / Cake pool
    const { amount: masterPoolAmount } = await masterChefContract.methods.userInfo('0', account).call()
  
    return { ...stakedBalances, 0: new BigNumber(masterPoolAmount).toJSON() }
  }

const fetchTokenPrice = async (id) => {
    const response = await request(
      GRAPH_API_PANCAKESWAP,
      gql`
        query Tokens($id: Bytes!){
          tokens(where: {id: $id}) {
            derivedUSD
          }
        }
    `,
      { id },
    )
    return response.tokens
}

module.exports = { fetchUserStakeBalances, fetchTokenPrice }