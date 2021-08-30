var ReputationService = require('../../services/reputation.service')
var AppError = require('../../models/appError.model')

class ReputationController {
    constructor() {
        this.reputationService = new ReputationService();
    }

    async invest(req, res) {
        try{
            let investInfo = await this.reputationService.invest(req.body.address, req.body.invested_platforms);
            res.status(200).send(investInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async search(req, res) {
        try {
            let searchInfo = await this.reputationService.search(req.body.address, req.body.invested_platforms);
            res.status(200).send(searchInfo);
        } catch(e) {
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async getReputation(req, res) {
        try {
            let reputationInfo = await this.reputationService.getReputation(req.body.address);
            res.status(200).send(reputationInfo);
        } catch(e) {
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async getLastLoanDate(req, res) {
        try {
            let dateInfo = await this.reputationService.getLastLoanDate(req.body.address);
            res.status(200).send(dateInfo);
        } catch(e) {
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }
}

var reputationController = new ReputationController();
module.exports = {
    invest: function(req, res) { reputationController.invest(req, res); },
    search: function(req, res) { reputationController.search(req, res); },
    getReputation: function(req, res) { reputationController.getReputation(req, res); },
    getLastLoanDate: function(req, res) { reputationController.getLastLoanDate(req, res); }
}