const mongoose = require('mongoose');

const ReputationModel = mongoose.Schema({
   "address":{
      "type":"String",
      "required": true
   },
   "reputation": [{
       "dapp": "String",
       "reputation": [{
            "poolAddress": "String",
            "poolName": "String",
            "symbol": "String",
            "amount": "String",
            "borrow_rate": "String",
            "repUSD": "String"
       }]
   }],
   "borrowAmount": {
       type: "String"
   },
   "totalReputation": {
       type: "String",
   },
   "modified": {
       "type": "Date",
       "default": Date.now
   }
}, {
  timestamps: false
});

module.exports = mongoose.model('Reputation', ReputationModel);
