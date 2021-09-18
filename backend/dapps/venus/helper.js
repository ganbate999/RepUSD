const async = require("async");
const { getWeb3ETHNoAccount, getWeb3BSCNoAccount } = require("../utils/web3");
const config = require("./constants");
const BigNumber = require("bignumber.js");

const { request, gql } = require("graphql-request");
const { GRAPH_API_PANCAKESWAP } = require("../config");

const TOKEN_ABI = {
  sxp: config.CONTRACT_SXP_TOKEN_ABI,
  usdc: config.CONTRACT_USDC_TOKEN_ABI,
  usdt: config.CONTRACT_USDT_TOKEN_ABI,
  busd: config.CONTRACT_BUSD_TOKEN_ABI,
  xvs: config.CONTRACT_XVS_TOKEN_ABI,
  btcb: config.CONTRACT_BTCB_TOKEN_ABI,
  eth: config.CONTRACT_ETH_TOKEN_ABI,
  ltc: config.CONTRACT_LTC_TOKEN_ABI,
  xrp: config.CONTRACT_XRP_TOKEN_ABI,
  bch: config.CONTRACT_BCH_TOKEN_ABI,
  dot: config.CONTRACT_DOT_TOKEN_ABI,
  link: config.CONTRACT_LINK_TOKEN_ABI,
  dai: config.CONTRACT_DAI_TOKEN_ABI,
  fil: config.CONTRACT_FIL_TOKEN_ABI,
  beth: config.CONTRACT_BETH_TOKEN_ABI,
  ada: config.CONTRACT_ADA_TOKEN_ABI,
  doge: config.CONTRACT_DOGE_TOKEN_ABI,
};

const getUserPools = async (id) => {
  let assetList = [];
  let account = id;
  let _result = [];
  for (
    let index = 0;
    index < Object.values(config.CONTRACT_TOKEN_ADDRESS).length;
    index++
  ) {
    const item = Object.values(config.CONTRACT_TOKEN_ADDRESS)[index];
    let tokencontract = null;
    let tokenDecimal = item.decimals;
    let vBepContract = getVbepContract(item.id);
    let vBepAddress = config.CONTRACT_VBEP_ADDRESS[item.id].address
                      ? config.CONTRACT_VBEP_ADDRESS[item.id].address
                        : config.CONTRACT_VBEP_ADDRESS.usdc.address
    const _supplyBalance = await vBepContract.methods
      .balanceOfUnderlying(`${account}`)
      .call();
    let supplyBalance = new BigNumber(_supplyBalance).div(
      new BigNumber(10).pow(tokenDecimal)
    );

    if (supplyBalance > 0) {
      let data = await fetchTokenPrice(item.address.toLowerCase());
      let { derivedUSD } = data[0];

      let balanceUSD = supplyBalance.multipliedBy(new BigNumber(parseFloat(derivedUSD)))
          .toString()
      let _temp = {
        address: vBepAddress,
        name: item.symbol,
        symbol: item.symbol,
        balance: supplyBalance.toString(),
        balanceUSD,
      };
      _result.push(_temp);
    }
  }
  return _result;
};

const getVbepContract = (name) => {
  let web3 = getWeb3BSCNoAccount();
  return new web3.eth.Contract(
    JSON.parse(
      name !== "bnb" ? config.CONTRACT_VBEP_ABI : config.CONTRACT_VBNB_ABI
    ),
    config.CONTRACT_VBEP_ADDRESS[name].address
      ? config.CONTRACT_VBEP_ADDRESS[name].address
      : config.CONTRACT_VBEP_ADDRESS.usdc.address
  );
};

const fetchTokenPrice = async (id) => {
  const response = await request(
    GRAPH_API_PANCAKESWAP,
    gql`
      query Tokens($id: Bytes!) {
        tokens(where: { id: $id }) {
          derivedUSD
        }
      }
    `,
    { id }
  );
  return response.tokens;
};

module.exports = { getUserPools, getVbepContract, fetchTokenPrice };