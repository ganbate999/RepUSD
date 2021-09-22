const { request, gql } = require('graphql-request');
const { GRAPH_API_BALANCER } = require('../config');

const getUserPools = async (id) => {
    const response = await request(
      GRAPH_API_BALANCER,
      gql`
      query PoolShares($id: ID!) { 
          poolShares (first: 1000, where: {balance_gt:0, userAddress: $id}) { 
              poolId { 
                  address
                  symbol
                  name
                  totalLiquidity
                  totalShares
              }
              balance 
            } 
        }
    `,
      { id },
    )
    return response.poolShares
  }

  // export const getPoolTokens = async(id) => {
  //   const response = await request(
  //       GRAPH_API_BALANCER,
  //       gql`
  //       query PoolTokens($id: ID!) { 
  //           poolTokens(where: {poolId: $id}) {
  //               symbol
  //           }
  //         }
  //     `,
  //       { id },
  //     )
  //     return response.poolTokens
  // }

  module.exports = { getUserPools };