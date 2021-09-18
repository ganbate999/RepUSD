const { request, gql } = require('graphql-request')
const { GRAPH_API_YEARN } = require('../config')

const getUserPools = async (id) => {
    const response = await request(
      GRAPH_API_YEARN,
      gql`
        query getData($id: ID!) {
          accountVaultPositions( where : {account : $id}) {
            token {
               symbol
               name
               decimals
            }
            balanceTokens
            vault {
              id
              vaultDayData {
                tokenPriceUSDC
              }
            }
          }
        }
    `,
      { id },
    )
    return response.accountVaultPositions
  }

module.exports = { getUserPools }