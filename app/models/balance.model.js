module.exports = (sequelize, Sequelize) => {
    const Balance = sequelize.define('balance', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        balance: {
            type: Sequelize.FLOAT,
            defaultValue: 0.0
        },
        username: {
            type: Sequelize.STRING,
            references: {
                model: 'users',
                key: 'username'
            },
            allowNull: false
        }
    });

    return Balance;
}