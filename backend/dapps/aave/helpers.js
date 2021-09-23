const { request, gql } = require('graphql-request');
const { GRAPH_API_AAVE } = require('../config');

const getUserPools = async (id) => {
    const response = await request(
        GRAPH_API_AAVE,
      gql`
      query Users($id: ID!) { 
          users (where: {id: $id}) { 
              reserves { 
                  pool {
                      id
                  }
                  reserve {
                      symbol
                      decimals
                      price {
                          priceInEth
                          oracle {
                            usdPriceEth
                          }
                      }
                  }
                  currentATokenBalance
               }
            } 
        }
    `,
      { id },
    )
    return response.users
  }

  module.exports = { getUserPools };