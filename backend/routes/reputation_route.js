const express = require('express');
const reputationController = require('../api/controllers/reputation.controller');
const accountController = require('../api/controllers/account.controller');

const apiAccount = express.Router();

apiAccount.post('/getlastdate', accountController.authenticateToken, reputationController.getLastLoanDate);
apiAccount.post('/getreputation', accountController.authenticateToken, reputationController.getReputation);
apiAccount.post('/search', accountController.authenticateToken, reputationController.search);
apiAccount.post('/invest', accountController.authenticateToken, reputationController.invest);

module.exports = apiAccount;