const { request, gql } = require('graphql-request')
const { GRAPH_API_QUICKSWAP } = require('../config')

const getUserPools = async (id) => {
    const response = await request(
      GRAPH_API_QUICKSWAP,
      gql`
        query LiquidityPositions($id: ID!){
          liquidityPositions(where: {user: $id}) {
            liquidityTokenBalance
            pair {
              token0 {
                symbol
              }
              token1 {
                symbol
              }
              reserveUSD
              totalSupply
            }
          }
        }
    `,
      { id },
    )
    return response.liquidityPositions
  }
 
module.exports = { getUserPools };