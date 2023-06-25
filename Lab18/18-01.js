const http = require('http');
const fs = require('fs');
const sequelize = require('sequelize');

let seq = new sequelize.Sequelize('hiring', 'sa', 'Kirill1203', {
    host: '127.0.0.1', dialect: 'mssql',
    hooks: {
        beforeBulkDestroy(instance, options) {
            console.log('---- Global Before Delete ----');
        }
    }
});
const {Employee, Office, Job, JobType, Profession} = require('./model.js').init(seq);

seq.authenticate().then(() => {
    Office.scope('officesByCapacity').findAll().then(result => result.forEach(e => console.log(e.dataValues)));
})

seq.authenticate().then(() =>
    Office.findAll().then(result => result.forEach(e => console.log(e.dataValues)))
        .then(() => seq.transaction({isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED})
            .then(t => Office.update({capacity: 0}, {where: {id: {[sequelize.Op.gt]: 0}}, transaction: t})
                .then(() => {
                    Office.findAll({transaction: t}).then(result => result.forEach(e => console.log(e.dataValues)));
                    setTimeout(() => {
                        t.rollback().then(() => Office.findAll().then(result => result.forEach(e => console.log(e.dataValues))));
                    }, 10000);
                })
            )
        )
)

http.createServer((req, res) => {
        if (req.method === 'GET' && req.url === '/') {
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            res.end(fs.readFileSync('index.html'));
        } else if (req.url.startsWith('/api')) {
            let rjc = err => {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end(err.message);
            };
            let rsl = data => {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(data));
            };
            let data = '';
            req.on('data', chunk => data += chunk);
            req.on('end', () => {
                let url = require('url').parse(req.url).pathname.substring('/api'.length);
                let paths = decodeURI(url.substring(1, url.length)).split('/');
                let model = [Employee, Office, Job, JobType, Profession].find(m => m.tableName === paths[0]);
                let param = paths.length > 1 ? paths[1] : null;
                let ext = [Employee, Office, Job, JobType, Profession].find(m => m.tableName === paths[2]);
                seq.authenticate().then(() => {
                    if (req.method === 'GET') {
                        model.findAll({
                            include: ext ? [{
                                model: ext,
                                where: param ? {id: param} : undefined,
                                required: false
                            }] : undefined
                        })
                            .then(result => rsl(result.map(e => e.dataValues)))
                            .catch(err => rjc(err));
                    } else if (req.method === 'POST') {
                        model.create(JSON.parse(data))
                            .then(result => rsl(result.dataValues))
                            .catch(err => rjc(err));
                    } else if (req.method === 'PUT') {
                        model.update(JSON.parse(data), {where: {id: param}})
                            .then(() => {
                                model.findOne({where: {id: param}})
                                    .then(result => rsl(result.dataValues))
                            }).catch(err => rjc(err));
                    } else if (req.method === 'DELETE') {
                        model.findOne({where: {id: param}})
                            .then(result => {
                                model.destroy({where: {id: param}})
                                    .then(() => rsl(result.dataValues))
                                    .catch(err => rjc(err));
                            }).catch(err => rjc(err));
                    }
                }).catch(err => rjc(err));
            });
        } else {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end('Bad request');
        }
    }
).listen(3000);