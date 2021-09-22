const { request, gql } = require('graphql-request')
const { GRAPH_API_UNISWAP, GRAPH_API_UNISWAP_V3 } = require('../config')

const getUserPools = async (id) => {
    const response = await request(
      GRAPH_API_UNISWAP,
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
  const getUserPoolsV3 = async (id) => {
    const response = await request(
      GRAPH_API_UNISWAP_V3,
      gql`
        query Positions($id: Bytes!){
          positions(where: {owner: $id}) {
            liquidity
            depositedToken0
            depositedToken1
            pool {
              id
            }
            token0 {
              symbol
              volume
              volumeUSD
              untrackedVolumeUSD
            }
            token1 {
              symbol
              volume
              volumeUSD
              untrackedVolumeUSD
            }
          }
        }
    `,
      { id },
    )
    return response.positions
  }
module.exports = { getUserPools, getUserPoolsV3 };