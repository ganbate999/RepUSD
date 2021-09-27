const { Interface } = require('@ethersproject/abi')
const { getWeb3ETHNoAccount } = require('./web3');
const { multicallABI } = require('../../abi/pancakeswap/multicall')
const { multicallETHContractAddress } = require('../config');

const multicallETH = async (abi, calls) => {
  const web3 = await getWeb3ETHNoAccount()
  const multi = new web3.eth.Contract(multicallABI, multicallETHContractAddress)
  const itf = new Interface(abi)

  const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
  const { returnData } = await multi.methods.aggregate(calldata).call()
  const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))
  return res
}

module.exports = { multicallETH }
