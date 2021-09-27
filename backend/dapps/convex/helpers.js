const { getWeb3ETHNoAccount } = require('../utils/web3');
const { multicallETH } = require('../utils/multicallETH');
const { GRAPH_API_UNISWAP } = require('../config')
const { request, gql } = require('graphql-request')
const { CONVEX_POOLMANAGER, CVXCRV_REWARDS_ADDRESS, CVX_REWARDS_ADDRESS, POOL_MANAGER_ABI, REWARD_POOL_ABI, LP_ERC20_ABI } = require('./convexconfig');
const BigNumber = require('bignumber.js');

const fetchTokenPrice = async (id) => {
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
      { id },
    )

    if (!!response.token.derivedETH)
        return response.token.derivedETH * response.bundles[0].ethPrice
    else
        return 0;
  }

const getUserPools = async (acc) => {
    let lpAddresses = await getLptokenAddresses();
    const web3 = getWeb3ETHNoAccount();
    let return_val = []
    let len = lpAddresses.length;
    const calls = lpAddresses.map((lpAddress) => {
        return {
            address: lpAddress.crvRewards,
            name: 'balanceOf',
            params: [acc]
        }
    })
    calls.push({ address: CVXCRV_REWARDS_ADDRESS, name: 'balanceOf', params: [acc] });
    calls.push({ address: CVX_REWARDS_ADDRESS, name: 'balanceOf', params: [acc] });
    const rawStakedBalances = await multicallETH(REWARD_POOL_ABI, calls);
    const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
        return new BigNumber(stakedBalance[0]._hex).toJSON()
    })
    for(let i = 0 ; i < len + 2; i++){
        if (parsedStakedBalances[i] !== "0" && parsedStakedBalances[i].length > 0) {
          let rewardAddress, symbol;
          if ( i < len ) {
            let lp_address = lpAddresses[i].lptoken;
            rewardAddress = lpAddresses[i].crvRewards;
            let lpContract = new web3.eth.Contract(LP_ERC20_ABI, lp_address);
            symbol = await lpContract.methods.symbol().call();
          }
          if ( i == len) {
              rewardAddress = CVXCRV_REWARDS_ADDRESS;
              symbol = 'cvxCRV';
          }
          else if (i == len + 1) {
              rewardAddress = CVX_REWARDS_ADDRESS;
              symbol = 'CVX';
          }
          let rewardContract = new web3.eth.Contract(REWARD_POOL_ABI, rewardAddress);
          rewardTokenAddress = await rewardContract.methods.rewardToken().call();
          let tokenPrice = await fetchTokenPrice(rewardTokenAddress.toLowerCase());
          let balance = parseFloat(parsedStakedBalances[i]) / (new BigNumber(10).pow(18));
          let amountUSD = balance * tokenPrice;
        
          let pool_info = {
            address: rewardAddress, 
            name: symbol + " Pool",
            symbol: symbol,
            balance: balance.toString(),
            amountUSD: amountUSD.toString()
          }
          return_val.push(pool_info);
        }
    }
    return return_val;
  }

const getLptokenAddresses = async () => {
    const web3 = getWeb3ETHNoAccount();
    let factoryContract = new web3.eth.Contract(POOL_MANAGER_ABI, CONVEX_POOLMANAGER);
    let allPairsLength = await factoryContract.methods.poolLength().call();
    let pairNos = []
    for (let i = 0; i < allPairsLength; i ++) 
        pairNos.push(i)
    const calls = pairNos.map((index) => {
        return {
            address: CONVEX_POOLMANAGER,
            name: 'poolInfo',
            params: [index]
        }
    })
    const lpAddresses = await multicallETH(POOL_MANAGER_ABI, calls);
    return lpAddresses
}

module.exports = { getUserPools }