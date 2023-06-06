module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define('transaction', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        action: {
            type: Sequelize.ENUM('transfer', 'receive'),
            allowNull: false
        },
        amount: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        sender: {
            type: Sequelize.STRING,
            references: {
                model: 'users',
                key: 'username'
            },
            allowNull: false
        },
        recipient: {
            type: Sequelize.STRING,
            references: {
                model: 'users',
                key: 'username'
            },
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('success', 'pending', 'failed'),
            allowNull: false
        }
    });

    return Transaction;
}