# Simple E-Wallet API

Built with Express.js, Sequelize, and Redis. Features include secure JWT Bearer token login and fund transfer functionality, allowing users to securely log in and transfer funds between wallets with simplicity and efficiency.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version X.X.X or higher)
- NPM (Node Package Manager)

## Getting Started

Follow the steps below to get the project up and running in your local:

1. Clone the Repository

   Clone the repository to your local machine using the following command:

   ```bash
   git clone https://github.com/arieeefrahman/simple-ewallet-api.git
   ```

2. Install Dependencies

    Navigate to the project directory and install the required dependencies by running the following command:

    ```
    npm install
    ```

3. Set up the .env file

    Create a .env file in the root directory of the project. Open the .env file and add the necessary configuration variables.

    ```
    # Database config
    DB_HOST=''
    DB_USERNAME=''
    DB_PASSWORD=''
    DB_NAME=''
    DB_DIALECT=''

    # App PORT
    PORT=""

    # Salt Config for Passwords
    SALT_ROUNDS=""

    # JSON Web Token
    JWT_ACCESS_SECRET_KEY=""
    JWT_ACCESS_EXPIRE_TIME="" # Expires time for JWT, e.g: 10m for 10 minutes
    JWT_REFRESH_SECRET_KEY=""
    JWT_REFRESH_EXPIRE_TIME=""

    # Redis
    REDIS_ACCESS_KEY_EXPIRE_TIME="" # Expires time for Redis, e.g 1 minutes => 1 * 60 = 60
    REDIS_REFRESH_KEY_EXPIRE_TIME="86400" # Expires time for Redis : 7 days => 7 * 24 hours => 168 * 60 * 60 = 604800
    REDIS_ACCESS_TOKEN_DB="" # database number in redis for store access token
    REDIS_REFRESH_TOKEN_DB="" # database number in redis for store refresh token
    ```
4. Run your redis application in local

5. Start the Project

    Start the project by running the following command:
    ```
    nodemon server.js
    ```

6. Happy testing in Postman or another app