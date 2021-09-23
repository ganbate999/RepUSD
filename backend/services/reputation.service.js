const { getUniswapReputation } = require('../dapps/uniswap');
const { getPancakeswapReputation } = require('../dapps/pancakeswap');
const { getCompoundReputation } = require('../dapps/compound');
const { getCurveReputation } = require('../dapps/curve');
const { getInstaDappReputation } = require('../dapps/insta');
const { getMakerReputation } = require('../dapps/maker');
const { getSushiReputation } = require('../dapps/sushi');
const { getVenusReputation } = require('../dapps/venus');
const { getYearnReputation } = require('../dapps/yearn');
const { getMdexReputation } = require('../dapps/mdex');
const { getBalancerReputation } = require('../dapps/balancer');
const { getAAVEReputation } = require('../dapps/aave');

var reputationModel = require('../models/reputation.model')
var userModel = require("../models/user.model")


const Web3 = require('web3');
const web3 = new Web3('https://data-seed-prebsc-1-s2.binance.org:8545/'); //testnet

const { RepUSDVaultABI } = require('../abi/repusdvault/repusdvault');

module.exports = class AccountService {

    constructor() {
    }
    async getReputation(address) {
        let reputation = await reputationModel.findOne({ address: address});
        return {
            success: true,
            result: reputation != null? reputation.totalReputation : 0
        }
    }
    async getLastLoanDate(address) {
        let reputation = await reputationModel.findOne({ address: address});
        return {
            success: reputation != null,
            result: reputation != null? reputation.modified : null
        }
    }
    async search(address, invested_platforms) {
        let reputation = await reputationModel.findOne({ address: address });
        if (reputation == null) {
            var reputationInfo = {
                address: address,
                reputation: [],
                totalReputation: 0,
                borrowAmount: 0,
                modified: 0
            }
            reputation = reputationInfo;
        }
        let prevBorrowAmount = parseFloat(reputation.borrowAmount.toString());
        let result = null;
        try {
            let userReputation = await this.calculateReputation(address, invested_platforms);
            let adminFee = 0;
            for (let i = 0; i < userReputation.length; i ++) {
                let sameDApp = 0;
                for (let j = 0; j < reputation.reputation.length; j ++) {
                    if (reputation.reputation[j].dapp == userReputation[i].dapp) {
                        sameDApp = 1;
                        let pools_searched = userReputation[i].reputation;
                        let pools_invested = reputation.reputation[j].reputation;
                        for (let ks = 0; ks < pools_searched.length; ks ++) {
                            let retain = 0;
                            for (let ki = 0; ki < pools_invested.length; ki ++) {
                                if ((pools_searched[ks].poolAddress == pools_invested[ki].poolAddress && pools_searched[ks].poolName == pools_invested[ki].poolName
                                    && pools_searched[ks].symbol == pools_invested[ki].symbol) && pools_searched[ks].balance <= pools_invested[ki].amount) {
                                    retain = 1;
                                }
                                if ((pools_searched[ks].poolAddress == pools_invested[ki].poolAddress && pools_searched[ks].poolName == pools_invested[ki].poolName 
                                    && pools_searched[ks].symbol == pools_invested[ki].symbol) && pools_searched[ks].balance > pools_invested[ki].amount) {
                                    reputation.reputation[j].reputation[ki].amount = pools_searched[ks].balance;
                                    adminFee += (pools_searched[ks].balanceUSD - pools_invested[ki].repUSD) * 0.5 / 100;       
                                    reputation.reputation[j].reputation[ki].repUSD = pools_searched[ks].balanceUSD;
                                    retain = 1;
                                }
                            }
                            if (retain == 0) {
                                let newRep = {
                                    poolAddress: pools_searched[ks].poolAddress,
                                    poolName: pools_searched[ks].poolName,
                                    symbol: pools_searched[ks].symbol,
                                    amount: pools_searched[ks].balance,
                                    borrow_rate: (pools_searched[ks].poolName.toLowerCase().indexOf("repusd") >= 0 || pools_searched[ks].symbol.toLowerCase().indexOf("repusd") >= 0)? 90 : 75,
                                    repUSD: pools_searched[ks].balanceUSD
                                }
                                adminFee += pools_searched[ks].balanceUSD * 0.5 / 100;
                                reputation.reputation[j].reputation.push(newRep);
                            }
                        }
                    }
                }
                if (sameDApp == 0) {
                    let newDApp = {
                        dapp: userReputation[i].dapp,
                        reputation: []
                    }
                    for (let j = 0; j < userReputation[i].reputation.length; j ++) {
                        let newRep = {
                            poolAddress: userReputation[i].reputation[j].poolAddress,
                            poolName: userReputation[i].reputation[j].poolName,
                            symbol: userReputation[i].reputation[j].symbol,
                            amount: userReputation[i].reputation[j].balance,
                            borrow_rate: (userReputation[i].reputation[j].poolName.toLowerCase().indexOf("repusd") >= 0 || userReputation[i].reputation[j].symbol.toLowerCase().indexOf("repusd") >= 0)? 90 : 75,
                            repUSD: userReputation[i].reputation[j].balanceUSD
                        }
                        adminFee += userReputation[i].reputation[j].balanceUSD * 0.5 / 100;
                        newDApp.reputation.push(newRep);
                    }
                    reputation.reputation.push(newDApp);
                }
            }

            let totalReputation = 0;
            for (let i = 0; i < reputation.reputation.length; i ++) {
                let pools = reputation.reputation[i].reputation;
                for (let j = 0; j < pools.length; j ++) {
                    totalReputation += parseFloat(pools[j].repUSD);
                }
            }

            let borrowAmount = 0;
            for (let i = 0; i < reputation.reputation.length; i ++) {
                let pools = reputation.reputation[i].reputation;
                for (let j = 0; j < pools.length; j ++) {
                    borrowAmount += parseFloat(pools[j].repUSD) * parseFloat(pools[j].borrow_rate) / 100;
                }
            }
            return {
                success: true,
                result: {
                    reputation: reputation.reputation,
                    totalReputation: totalReputation.toString(),
                    borrowAmount: (borrowAmount - prevBorrowAmount).toString()
                }
            }
        } catch(error) {
            result = null;
            console.log(error);
        }
        return {
            success: result != null,
            result: result
        }
    }

    async invest(address, invested_platforms) {
        let reputation = await reputationModel.findOne({ address: address });
        let result = null;
        if (reputation == null) {
          var reputationInfo = {
              address: address,
              reputation: [],
              totalReputation: 0,
              borrowAmount: 0,
              modified: 0
          }
          reputation = await reputationModel.create(reputationInfo)
        }
        try {
            let userReputation = await this.calculateReputation(address, invested_platforms);
            let adminFee = 0;
            for (let i = 0; i < userReputation.length; i ++) {
                let sameDApp = 0;
                for (let j = 0; j < reputation.reputation.length; j ++) {
                    if (reputation.reputation[j].dapp == userReputation[i].dapp) {
                        sameDApp = 1;
                        let pools_searched = userReputation[i].reputation;
                        let pools_invested = reputation.reputation[j].reputation;
                        for (let ks = 0; ks < pools_searched.length; ks ++) {
                            let retain = 0;
                            for (let ki = 0; ki < pools_invested.length; ki ++) {
                                if ((pools_searched[ks].poolAddress == pools_invested[ki].poolAddress && pools_searched[ks].poolName == pools_invested[ki].poolName
                                    && pools_searched[ks].symbol == pools_invested[ki].symbol) && pools_searched[ks].balance <= pools_invested[ki].amount) {
                                    retain = 1;
                                }
                                if ((pools_searched[ki].poolAddress == pools_invested[ks].poolAddress && pools_searched[ks].poolName == pools_invested[ki].poolName 
                                    && pools_searched[ks].symbol == pools_invested[ki].symbol) && pools_searched[ks].balance > pools_invested[ki].amount) {
                                    reputation.reputation[j].reputation[ki].amount = pools_searched[ks].balance;
                                    adminFee += (pools_searched[ks].balanceUSD - pools_invested[ki].repUSD) * 0.5 / 100;       
                                    reputation.reputation[j].reputation[ki].repUSD = pools_searched[ks].balanceUSD;
                                    retain = 1;
                                }
                            }
                            if (retain == 0) {
                                let newRep = {
                                    poolAddress: pools_searched[ks].poolAddress,
                                    poolName: pools_searched[ks].poolName,
                                    symbol: pools_searched[ks].symbol,
                                    amount: pools_searched[ks].balance,
                                    borrow_rate: (pools_searched[ks].poolName.toLowerCase().indexOf("repusd") >= 0 || pools_searched[ks].symbol.toLowerCase().indexOf("repusd") >= 0)? 90 : 75,
                                    repUSD: pools_searched[ks].balanceUSD
                                }
                                adminFee += pools_searched[ks].balanceUSD * 0.5 / 100;
                                reputation.reputation[j].reputation.push(newRep);
                            }
                        }
                    }
                }
                if (sameDApp == 0) {
                    let newDApp = {
                        dapp: userReputation[i].dapp,
                        reputation: []
                    }
                    for (let j = 0; j < userReputation[i].reputation.length; j ++) {
                        let newRep = {
                            poolAddress: userReputation[i].reputation[j].poolAddress,
                            poolName: userReputation[i].reputation[j].poolName,
                            symbol: userReputation[i].reputation[j].symbol,
                            amount: userReputation[i].reputation[j].balance,
                            borrow_rate: (userReputation[i].reputation[j].poolName.toLowerCase().indexOf("repusd") >= 0 || userReputation[i].reputation[j].symbol.toLowerCase().indexOf("repusd") >= 0)? 90 : 75,
                            repUSD: userReputation[i].reputation[j].balanceUSD
                        }
                        adminFee += userReputation[i].reputation[j].balanceUSD * 0.5 / 100;
                        newDApp.reputation.push(newRep);
                    }
                    reputation.reputation.push(newDApp);
                }
            }

            let totalReputation = 0;
            for (let i = 0; i < reputation.reputation.length; i ++) {
                let pools = reputation.reputation[i].reputation;
                for (let j = 0; j < pools.length; j ++) {
                    totalReputation += parseFloat(pools[j].repUSD);
                }
            }

            let borrowAmount = 0;
            for (let i = 0; i < reputation.reputation.length; i ++) {
                let pools = reputation.reputation[i].reputation;
                for (let j = 0; j < pools.length; j ++) {
                    borrowAmount += parseFloat(pools[j].repUSD) * parseFloat(pools[j].borrow_rate) / 100;
                }
            }
            if (borrowAmount > reputation.borrowAmount && borrowAmount > 0) {
                reputation.totalReputation = totalReputation;
                reputation.borrowAmount = borrowAmount;
                reputation.modified = Date.now();
                
                await this.borrow(address, web3.utils.toWei(borrowAmount.toString(10), 'ether'), web3.utils.toWei(adminFee.toString(10), 'ether'));
                result = await reputation.save();
            }
        } catch(error) {
            result = null;
            console.log(error);
        }
        return {
            success: result != null,
            result: result
        }
    }

    async calculateReputation(address, invested_platforms) {
        var userReputation = [];
        if (invested_platforms.indexOf("pancakeswap") >= 0) {
            let pancakeswapRep = await getPancakeswapReputation(address);
            if (pancakeswapRep.length > 0) {
                userReputation.push({ dapp: 'pancakeswap', reputation: pancakeswapRep });
            }
        }
        if (invested_platforms.indexOf("uniswap") >= 0) {
            let uniswapRep = await getUniswapReputation(address);
            if (uniswapRep.length > 0) {
                userReputation.push({ dapp: 'uniswap', reputation: uniswapRep });
            }
        }
        if (invested_platforms.indexOf("compound") >= 0) {
            let compoundRep = await getCompoundReputation(address);
            if (compoundRep.length > 0) {
                userReputation.push({ dapp: 'compound', reputation: compoundRep });
            }
        }
        if (invested_platforms.indexOf("curve") >= 0) {
            let curveRep = await getCurveReputation(address);
            if (curveRep.length > 0) {
                userReputation.push({ dapp: 'curve', reputation: curveRep });
            }
        }
        if (invested_platforms.indexOf("instadapp") >= 0) {
            let instaRep = await getInstaDappReputation(address);
            if (instaRep.length > 0) {
                userReputation.push({ dapp: 'instadapp', reputation: instaRep });
            }
        }
        if (invested_platforms.indexOf("maker") >= 0) {
            let makerRep = await getMakerReputation(address);
            if (makerRep.length > 0) {
                userReputation.push({ dapp: "maker", reputation: makerRep });
            }
        }
        if (invested_platforms.indexOf("sushiswap") >= 0) {
            let sushiRep = await getSushiReputation(address);
            if (sushiRep.length > 0) {
                userReputation.push({ dapp: "sushiswap", reputation: sushiRep });
            }
        }
        if (invested_platforms.indexOf("venus") >= 0) {
            let venusRep = await getVenusReputation(address);
            if (venusRep.length > 0) {
                userReputation.push({ dapp: "venus", reputation: venusRep });
            }
        }
        if (invested_platforms.indexOf("yearn") >= 0) {
            let yearnRep = await getYearnReputation(address);
            if (yearnRep.length > 0) {
                userReputation.push({ dapp: "yearn", reputation: yearnRep });
            }
        }
        if (invested_platforms.indexOf("mdex") >= 0) {
            let mdexRep = await getMdexReputation(address);
            if (mdexRep.length > 0) {
                userReputation.push({ dapp: "mdex", reputation: mdexRep });
            }
        }
        if (invested_platforms.indexOf("balancer") >= 0) {
            let balancerRep = await getBalancerReputation(address);
            if (balancerRep.length > 0) {
                userReputation.push({ dapp: "balancer", reputation: balancerRep });
            }
        }
        if (invested_platforms.indexOf('aave') >= 0) {
            let aaveRep = await getAAVEReputation(address);
            if (aaveRep.length > 0) {
                userReputation.push({ dapp: "aave", reputation: aaveRep });
            }
        }
        return userReputation;
    }

    async borrow(user, reputation, adminFee) {
        var privKey = process.env.PRIVATE_KEY;
        var vaultContractAddress = process.env.VAULT_CONTRACT;
        var repUSDVaultContract = new web3.eth.Contract(RepUSDVaultABI, vaultContractAddress);
        try {
            let encoded = repUSDVaultContract.methods.borrow(user, reputation, adminFee).encodeABI();
            var tx = {
                gasLimit: web3.utils.toHex(6200000),
                to: vaultContractAddress,
                data: encoded
            }
            let signed = await web3.eth.accounts.signTransaction(tx, privKey);
            let amountMinted = await web3.eth.sendSignedTransaction(signed.rawTransaction);
            return amountMinted;
        } catch (error) {
          console.log(error);
          throw error;  
        };
    }

    async deduct(user, reputation) {
        var privKey = process.env.PRIVATE_KEY;
        var vaultContractAddress = process.env.VAULT_CONTRACT;
        var repUSDVaultContract = new web3.eth.Contract(RepUSDVaultABI, vaultContractAddress);
        try {
            let encoded = repUSDVaultContract.methods.deduct(user, reputation).encodeABI();
            var tx = {
                gasLimit: web3.utils.toHex(6200000),
                to: vaultContractAddress,
                data: encoded
            }
            let signed = await web3.eth.accounts.signTransaction(tx, privKey);
            let amountBurned = await web3.eth.sendSignedTransaction(signed.rawTransaction);
            return amountBurned;
        } catch (error) {
          console.log(error);
          throw error;  
        };
    }
}