const db = require("../models");
const UserModel = db.users;
const Balance = db.balances;
const { accessTokenClient, refreshTokenClient } = require('../redis/client');
const Validator = require('fastest-validator');
const v = new Validator();
const { hashing, comparePassword } = require('../utils/hash')
const { accessClaims, refreshClaims } = require('../utils/jwt')
const baseResponse = require('./base-response')

/**
    * Registers a new user account
    *
    * @param {Object} req - The HTTP request object
    * @param {Object} res - The HTTP response object
    *
    * @throws {Error} If an internal server error occurs
    *
    * @returns {Object} The HTTP response object with status and data
*/
const register = async (req, res) => {
    // Define the schema to validate the request body parameters
    const schema = {
        fullName: { type: 'string', min: 3, max: 255, label: "Full Name"},
        email: { type: 'email', label: 'Email Address'},
        username: { type: 'string', min: 5, max: 30},
        password: { type: 'string', min: 8, max: 255}
    }
    
    // Validate the request body against the schema
    const validate = v.validate(req.body, schema);

    // If the validation fails, return a 400 response with the validation errors
    if (validate.length) {
        return baseResponse(res, 400, 'failed', validate);
    }

    // Extract the username and password from the request body
    const username = req.body.username;
    const email = req.body.email;
    let password = req.body.password;
    const fullName = req.body.fullName;

    // Extract the default roles from dotenv
    const roles = process.env.USER_ROLES;
    
    // Hash the password
    try {
        password = hashing(password);
    } catch (error) {
        console.error('Error when hashing a password: ', error);
        
        return baseResponse(res, 500, 'failed', 'internal server error');
    }

    try {
        // Check if the username already used
        const isUsernameUsed = await UserModel.findOne({ where: { username } });

        if (isUsernameUsed) {
            return baseResponse(res, 400, 'failed', 'username already taken.')
        }

        // Check if the email already used
        const isEmailUsed = await UserModel.findOne({ where: { email } });

        if (isEmailUsed) {
            return baseResponse(res, 400, 'failed', 'email already taken.')
        }

        // Write data to database
        const account = await UserModel.create({username, password, roles, fullName, email });
        
        await Balance.create({username});
        
        // Extract the createdAt and updatedAt fields from the user object
        const { createdAt, updatedAt } = account.toJSON();

        // Choose the data to be displayed in the response
        const responseData = { username, createdAt, updatedAt };
        
        // Return a 201 response with the success message and the user data
        return baseResponse(res, 201, 'success', 'account created', responseData)
    } catch (error) {
        console.error('Error creating user: ', error);
        
        // Return a 500 response with an error message
        return baseResponse(res, 500, 'failed', 'internal server error');
    }
}

const login = async (req, res) => {
    // Define the schema to validate the request body parameters
    const schema = {
        username: { type: 'string', min: 5, max: 30},
        password: { type: 'string', min: 8, max: 255}
    }
    
    // Validate the request body against the schema
    const validate = v.validate(req.body, schema);

    // If the validation fails, return a 400 response with the validation errors
    if (validate.length) {
        return baseResponse(res, 400, 'failed', validate);
    }

    // Extract the username and password from the request body
    const username = req.body.username;
    let password = req.body.password;

    try {
        // Check if the user already exists
        const isAccountExist = await UserModel.findOne({ where: { username }});

        if (!isAccountExist) {
            return baseResponse(res, 401, 'failed', 'username or password is wrong.');
        }

        // Compare password input with hash password from database
        var hashedPassword = isAccountExist.password
        const isMatch = await comparePassword(password, hashedPassword);

        var userId = isAccountExist.id;
        var userRoles = isAccountExist.roles;

        if (!isMatch) {
            return baseResponse(res, 401, 'failed', 'username or password is wrong.');
        }

        // Generate JWT access token
        var access_token = accessClaims(userId, userRoles);
        var refresh_token = refreshClaims(userId);

        // Cache access token to redis
        // Token as the key, username as the value
        var accessExpireTime = parseInt(process.env.REDIS_ACCESS_KEY_EXPIRE_TIME);
        var refreshExpireTime = parseInt(process.env.REDIS_REFRESH_KEY_EXPIRE_TIME);
        
        await Promise.all([
            accessTokenClient.set(access_token, username, { EX: accessExpireTime }),
            refreshTokenClient.set(refresh_token, username, { EX: refreshExpireTime })
        ]);

        return baseResponse(res, 200, 'success', 'login success', { 'access token' : access_token, 'refresh_token': refresh_token });
    } catch (error) {
        console.error('Error when login : ', error);
        
        // Return a 500 response with an error message
        return baseResponse(res, 500, 'failed', 'internal server error');
    }
}

/**
 * Logout the user by deleting the access token from Redis and send a response indicating success.
 * 
 * @param {object} req - The HTTP request object
 * @param {object} res - The HTTP response object
 * @returns {void}
*/
const logout = async (req, res) => {
    // Get the access token from the authorization header
    var authHeader = req.headers.authorization;
    var token = authHeader.split(' ')[1];
    
    // Response 200. Send a success response to the client
    baseResponse(res, 200, 'success', 'logout success');
    
    // Delete the access token from Redis
    await Promise.all([accessTokenClient.del(token)]);
}

module.exports = { register, login, logout }