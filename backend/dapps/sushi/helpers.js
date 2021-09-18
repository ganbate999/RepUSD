const { request, gql } = require('graphql-request');
const { GRAPH_API_SUSHI } = require('../config');

const getUserPools = async (id) => {
    const response = await request(
      GRAPH_API_SUSHI,
      gql`
        query Users($id: Bytes!){
          user(id: $id) {
            id
            liquidityPositions {
              liquidityTokenBalance
              pair {
                id
                name
                token0 {
                  symbol
                }
                token1 {
                  symbol
                }
              }
              snapshots {
                reserveUSD
              }
            }
          }
        }
    `,
      { id },
    )
    return response.user
  }

module.exports = { getUserPools };