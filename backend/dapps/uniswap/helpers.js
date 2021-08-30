const { request, gql } = require('graphql-request')
const { GRAPH_API_UNISWAP } = require('../config')

const getUserPools = async (id) => {
    const response = await request(
      GRAPH_API_UNISWAP,
      gql`
        query Mints($id: Bytes!){
          mints(where: {to: $id}) {
            liquidity
            amountUSD
            pair {
              id
              token0 {
                symbol
              }
              token1 {
                symbol
              }
            }
          }
        }
    `,
      { id },
    )
    return response.mints
  }
module.exports = { getUserPools };