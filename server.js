require('dotenv').config()
const { PORT } = process.env;
const express = require('express');
const cors = require('cors');
const app = express();
let logger = require('morgan');
let { connectRedis } = require('./app/redis/client');
const userRoute = require('./app/routes/user.routes');
const transactionRoute = require('./app/routes/transaction.routes');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectRedis();

const db = require('./app/models');
db.sequelize.sync();

app.get('/', (req, res) => {
    res.send('Welcome to Simple E-wallet API!');
});

app.use('/api/user', userRoute);
app.use('/api/transaction', transactionRoute);

app.listen(PORT, () => console.log(`App listening on port http://localhost:${PORT}!`));
