const { request, gql } = require('graphql-request')
const { GRAPH_API_COMPOUND } = require('../config')

const getUserPools = async (id) => {
    const response = await request(
      GRAPH_API_COMPOUND,
      gql`
        query MintEvents($id: Bytes!) {
          mintEvents(where: {to: $id}) {
            from
            amount
            cTokenSymbol
          }
        }
    `,
      { id },
    )
    return response.mintEvents
}

const getTokenPrice = async(id) => {
    const response = await request(
      GRAPH_API_COMPOUND,
      gql`
        query Markets($id: String!) {
          markets(where: {symbol: $id}) {
            underlyingPriceUSD
            exchangeRate
          }
        }
      `,
      { id },
    )
    return response.markets;
}

module.exports = { getUserPools, getTokenPrice }