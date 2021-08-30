const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var userModel = require('../models/user.model')

module.exports = class AccountService {

    constructor() {
    }

    async login(address) {
        let success = false;
        let result = await userModel.findOne({ address: address });
        if (result == null) {
          var userInfo = {
            'address': address,
          }
          result = await userModel.create(userInfo);
        }
        if (result != null) {
          success = true;
          result._doc["token"] = jwt.sign({ address: address }, process.env.TOKEN_SECRET, {expiresIn: '1d'});
        }
        return {
          success: success,
          result: success? result : null
        }
    }

    authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
  
        if (token == null) return res.sendStatus(401)
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
          console.log(err)
  
          if (err) return res.sendStatus(403)
  
        //   req.user = users
  
          next()
        })
      }
      
}