const random = require('lodash/random')

// Array of available nodes to connect to
const bscnodes = ["https://bsc-dataseed1.ninicoin.io", "https://bsc-dataseed1.defibit.io", "https://bsc-dataseed.binance.org"]
const ethnodes = [ "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"];
const avaxnodes = [ "https://api.avax.network/ext/bc/C/rpc" ];

const getBSCRpcUrl = () => {
  const randomIndex = random(0, bscnodes.length - 1)
  return bscnodes[randomIndex]
}

const getETHRpcUrl = () => {
  const randomIndex = random(0, ethnodes.length - 1)
  return ethnodes[randomIndex]
}

const getAvaxRpcUrl = () => {
  const randomIndex = random(0, ethnodes.length - 1)
  return avaxnodes[randomIndex]
}

module.exports = { bscnodes, ethnodes, avaxnodes, getBSCRpcUrl, getETHRpcUrl, getAvaxRpcUrl }