const mongoose = require('mongoose');

const userModel = mongoose.Schema({
   "address":{
      "type":"String",
      "required": true
   }
}, {
  timestamps: false
});

module.exports = mongoose.model('Users', userModel);
