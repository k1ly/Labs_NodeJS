import sequelize from 'sequelize';

let seq = new sequelize.Sequelize('casl', 'sa', 'Kirill1203', {
    host: '127.0.0.1', dialect: 'mssql'
});

export default seq;