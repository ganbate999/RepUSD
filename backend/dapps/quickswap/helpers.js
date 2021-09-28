const { request, gql } = require('graphql-request')
const { GRAPH_API_QUICKSWAP } = require('../config')

const getUserPools = async (id) => {
    const response = await request(
      GRAPH_API_QUICKSWAP,
      gql`
        query Users($id: Bytes!){
          users(where: {id: $id}) {
            liquidityPositions {
              liquidityTokenBalance
              pair {
                id
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
        }
    `,
      { id },
    )
    return response.users
  }
 
module.exports = { getUserPools };