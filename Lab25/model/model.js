import sequelize from 'sequelize';

class User extends sequelize.Model {
    static get modelName() {
        return 'User';
    }
}

class Repo extends sequelize.Model {
    static get modelName() {
        return 'Repo';
    }
}

class Commit extends sequelize.Model {
    static get modelName() {
        return 'Commit';
    }
}

function initialize(seq) {
    User.init({
        id: {type: sequelize.BIGINT, primaryKey: true, autoIncrement: true},
        username: {type: sequelize.STRING, allowNull: false},
        email: {type: sequelize.STRING, allowNull: true},
        password: {type: sequelize.STRING, allowNull: false},
        role: {type: sequelize.STRING, allowNull: false}
    }, {
        sequelize: seq,
        modelName: 'User',
        tableName: 'users',
        timestamps: false
    });
    Repo.init({
        id: {type: sequelize.BIGINT, primaryKey: true, autoIncrement: true},
        name: {type: sequelize.STRING, allowNull: false},
        author: {type: sequelize.BIGINT, allowNull: false, references: {model: User, key: 'author'}}
    }, {
        sequelize: seq,
        modelName: 'Repo',
        tableName: 'repos',
        timestamps: false
    });
    Commit.init({
        id: {type: sequelize.BIGINT, primaryKey: true, autoIncrement: true},
        message: {type: sequelize.STRING, allowNull: false},
        repo: {type: sequelize.BIGINT, allowNull: false, references: {model: Repo, key: 'repo'}}
    }, {
        sequelize: seq,
        modelName: 'Commit',
        tableName: 'commits',
        timestamps: false
    });
    User.hasMany(Repo, {foreignKey: 'author'});
    Repo.belongsTo(User, {foreignKey: 'author'});
    Repo.hasMany(Commit, {foreignKey: 'repo'});
    Commit.belongsTo(Repo, {foreignKey: 'repo'});
}

function init(seq) {
    initialize(seq);
    return {User, Repo, Commit};
}

export {init};