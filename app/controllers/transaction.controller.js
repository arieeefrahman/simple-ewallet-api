const db = require("../models");
const TransactionModel = db.transactions;
const UserModel = db.users;
const BalanceModel = db.balances;
const { accessTokenClient } = require('../redis/client');
const Validator = require('fastest-validator');
const v = new Validator();
const baseResponse = require('./base-response');
const balanceModel = require("../models/balance.model");

/**
 * Transfer controller to perform a transaction between users
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} - Response object with transaction result
 */
const transfer = async (req, res) => {
    const schema = {
        amount: { type: 'number', positive: true},
        recipient: { type: 'string', label: 'sender username' }
    }

    const validate = v.validate(req.body, schema);

    // If the validation fails, return a 400 response with the validation errors
    if (validate.length) {
        return baseResponse(res, 400, 'failed', validate);
    }

    const amount = req.body.amount;
    const recipient = req.body.recipient;
    let sender;

    try {
        // Get the access token from the authorization header
        var authHeader = req.headers.authorization;
        var token = authHeader.split(' ')[1];
        sender = await accessTokenClient.get(token);
        
        if (sender == null) {
            return baseResponse(res, 401, 'unauthorized', 'invalid bearer token');
        }
    } catch (error) {
        console.error('Error when checking token in Redis: ', error);

        return baseResponse(res, 500, 'failed', 'internal server error');    }

    try {
        let isRecipientExist = await UserModel.findOne({ where: { username: recipient }})

        if (!isRecipientExist) {
            return baseResponse(res, 404, 'failed', 'recipient is not exist');
        }

        let isSenderExist = await UserModel.findOne({ where: { username: sender }})

        if (!isSenderExist) {
            return baseResponse(res, 404, 'failed', 'sender is not exist');
        }

        const status = "success";
        const transaction = await TransactionModel.create({ action: "transfer", amount, sender, recipient, status });
        await TransactionModel.create({ action: "receive", amount, recipient, sender, status });

        let updateBalance = await BalanceModel.findOne({ where: { username: sender } })

        updateBalance.set({
            balance
        })

        return baseResponse(res, 200, 'success', 'transaction success', transaction);
    } catch (error) {
        console.error('Error when making a transaction: ', error);

        return baseResponse(res, 500, 'failed', 'internal server error');
    }
}

module.exports = { transfer }