const { Interface } = require('@ethersproject/abi')
const { getWeb3BSCNoAccount } = require('./web3');
const { multicallABI } = require('../../abi/pancakeswap/multicall')
const { multicallContractAddress } = require('../config');

const multicall = async (abi, calls) => {
  const web3 = await getWeb3BSCNoAccount()
  const multi = new web3.eth.Contract(multicallABI, multicallContractAddress)
  const itf = new Interface(abi)

  const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
  const { returnData } = await multi.methods.aggregate(calldata).call()
  const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))
  return res
}

module.exports = { multicall }
