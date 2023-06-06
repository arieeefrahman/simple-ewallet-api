const { createClient } = require('redis');
const accessTokenClient = createClient();
const refreshTokenClient = createClient();
const forgotPassClient = createClient();

const connectRedis = async () => {
    try {
        await Promise.all([
            accessTokenClient.connect(),
            accessTokenClient.select(parseInt(process.env.REDIS_ACCESS_TOKEN_DB)),
            
            refreshTokenClient.connect(),
            refreshTokenClient.select(parseInt(process.env.REDIS_REFRESH_TOKEN_DB)),

            forgotPassClient.connect(),
            forgotPassClient.select(parseInt(process.env.REDIS_FORGOT_PASS_DB))
        ]);
        
        console.log('Redis Connected!');
    } catch (error) {
        console.log('Error connecting to Redis.', error);
    }
};

module.exports = { 
    connectRedis, 
    accessTokenClient, 
    refreshTokenClient 
}