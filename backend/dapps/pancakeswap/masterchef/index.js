const { request, gql } = require('graphql-request')
const { GRAPH_API_PANCAKESWAP } = require('../../config')

const fetchFarmUserStakedBalances = async (id) => {
    const response = await request(
      GRAPH_API_PANCAKESWAP,
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

module.exports = { fetchFarmUserStakedBalances }