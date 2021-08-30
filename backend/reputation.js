const { getUniswapReputation } = require('./dapps/uniswap');
const { getPancakeswapReputation } = require('./dapps/pancakeswap');
const { getCompoundReputation } = require('./dapps/compound');
const { getCurveReputation } = require('./dapps/curve');

require("./config/config")

var reputationModel = require('./models/reputation.model')
const ReputationService = require('./services/reputation.service')
var reputationService = new ReputationService;

const XHR = require('xhr2-cookies').XMLHttpRequest
XHR.prototype._onHttpRequestError = function (request, error) {
  if (this._request !== request) {
      return;
  }
  // A new line
  console.log(error, 'request')
  this._setError();
  request.abort();
  this._setReadyState(XHR.DONE);
  this._dispatchProgress('error');
  this._dispatchProgress('loadend');
};

setTimeout(function(){
    setInterval(async function(){
        var users = await reputationModel.find({});
        const reps = await Promise.all(users.map(async (user) => {
            try {
                let invested_platforms = user.reputation.map((item) => item.dapp);
                let userReputation = await reputationService.calculateReputation(user.address, invested_platforms);
                let deductedReputation = [];
                for (let i = 0; i < user.reputation.length; i ++) {
                    let sameDApp = 0;
                    for (let j = 0; j < userReputation.length; j ++) {
                        if (userReputation[j].dapp == user.reputation[i].dapp) {
                            sameDApp = 1;
                            let dAppReputation = [];
                            let pools_searched = userReputation[j].reputation;
                            let pools_invested = user.reputation[i].reputation;
                            for (let ks = 0; ks < pools_invested.length; ks ++) {
                                let retain = 0;
                                for (let ki = 0; ki < pools_searched.length; ki ++) {
                                    if ((pools_searched[ki].poolAddress == pools_invested[ks].poolAddress && pools_searched[ki].poolName == pools_invested[ks].poolName 
                                        && pools_searched[ki].symbol == pools_invested[ks].symbol) && pools_searched[ki].balance < pools_invested[ks].amount) {
                                        user.reputation[i].reputation[ks].amount = pools_searched[ki].balance;
                                        user.reputation[i].reputation[ks].repUSD = pools_searched[ki].balanceUSD;
                                        dAppReputation.push(user.reputation[i].reputation[ks]);
                                        retain = 1;
                                    }
                                    if ((pools_searched[ki].poolAddress == pools_invested[ks].poolAddress && pools_searched[ki].poolName == pools_invested[ks].poolName 
                                        && pools_searched[ki].symbol == pools_invested[ks].symbol) && pools_searched[ki].balance >= pools_invested[ks].amount) {
                                        dAppReputation.push(user.reputation[i].reputation[ks]);
                                        retain = 1;
                                    }
                                }
                            }
                            deductedReputation.push({dapp: user.reputation[i].dapp, reputation: dAppReputation});
                        }
                    }
                }

                let totalReputation = 0;
                for (let i = 0; i < deductedReputation.length; i ++) {
                    let pools = deductedReputation[i].reputation;
                    for (let j = 0; j < pools.length; j ++) {
                        totalReputation += parseFloat(pools[j].repUSD);
                    }
                }

                let borrowAmount = 0;
                for (let i = 0; i < deductedReputation.length; i ++) {
                    let pools = deductedReputation[i].reputation;
                    for (let j = 0; j < pools.length; j ++) {
                        borrowAmount += parseFloat(pools[j].repUSD) * parseFloat(pools[j].borrow_rate) / 100;
                    }
                }

                if (totalReputation < user.totalReputation) {
                    let rep = reputationModel.findOne({ address: user.address });
                    rep.reputation = deductedReputation;
                    rep.totalReputation = totalReputation;
                    rep.borrowAmount = borrowAmount;
                    rep.modified = Date.now();
                    let res = await rep.save();
                    return {
                        address: user.address,
                        reputation: res.totalReputation
                    }
                } else {
                    return {
                        address: user.address,
                        reputation: null
                    }
                }
            } catch(err) {
                console.log(err);
            }
            return {
                address: user.address,
                reputation: null
            };
        }));
        try {
            for (let i = 0; i < reps.length; i ++) {
                if (reps[i].reputation != null) {
                    await reputationService.deduct(reps[i].address, reps[i].reputation);
                }
            }
        } catch(err) {
            console.log(err);
        }
    }, 1000 * 30);//
},1000);

async function getTotalReputation(address) {
    let userReputation = []
    let totalReputation = 0;
    let uniswapRep = await getUniswapReputation(userAddress);
    userReputation.push({ dapp: 'uniswap', reputation: uniswapRep });
    let pancakeswapRep = await getPancakeswapReputation(userAddress);
    userReputation.push({ dapp: 'pancakeswap', reputation: pancakeswapRep });
    let compoundRep = await getCompoundReputation(userAddress);
    userReputation.push({ dapp: 'compound', reputation: compoundRep });
    let curveRep = await getCurveReputation(userAddress);
    userReputation.push({ dapp: 'curve', reputation: curveRep });
    for (const key in userReputation) {
        let reputation = userReputation[key].reputation;
        let length = reputation.length;
        for (let i = 0; i < length; i ++) {
            totalReputation += parseFloat(reputation[i].balanceUSD);
        }
    }
    return totalReputation;
}