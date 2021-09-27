const { request, gql } = require('graphql-request');
const { GRAPH_API_ALPACA } = require('../config');

const getUserPools = async (id) => {
    const response = await request(
        GRAPH_API_ALPACA,
      gql`
      query Balances($id: ID!) { 
          balances (where: {id: $id}) { 
              amount
            } 
        }
    `,
      { id },
    )
    return response.balances
  }

  module.exports = { getUserPools };