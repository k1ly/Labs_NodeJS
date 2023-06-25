import sequelize from 'sequelize';

class User extends sequelize.Model {
}

function initialize(seq) {
    User.init({
        id: {type: sequelize.BIGINT, primaryKey: true, autoIncrement: true},
        username: {type: sequelize.STRING, allowNull: false},
        password: {type: sequelize.STRING, allowNull: false}
    }, {
        sequelize: seq,
        modelName: 'User',
        tableName: 'users',
        timestamps: false
    });
}

function init(seq) {
    initialize(seq);
    return {User};
}

export {init};