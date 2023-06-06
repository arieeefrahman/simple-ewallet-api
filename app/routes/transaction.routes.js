const transactionController = require('../controllers/transaction.controller');
const router = require('express').Router();

router.post('/transfer', transactionController.transfer)

// router.post('/register', userController.register);
// router.post('/login', userController.login);
// router.post('/logout', userController.logout);

module.exports = router;