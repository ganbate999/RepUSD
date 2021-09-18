const { request, gql } = require('graphql-request');
const { GRAPH_API_MAKER } = require('../config');

const getUserPools = async (id) => {
    const response = await request(
      GRAPH_API_MAKER,
      gql`
        query getPool($id: Bytes!) {
          users (where : {address : $id}){
            vaults{
              id
              collateralType{
                id
                price {
                  value
                }
              }
              collateral
              debt
            }
          }
        }
    `,
      { id },
    )
    return response.users
  }

  module.exports = { getUserPools }