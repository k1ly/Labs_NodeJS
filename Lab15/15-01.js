const http = require('http');
const db = require('mongodb');

let url = 'mongodb+srv://kirill:Kirill1203@default.tswu4wr.mongodb.net/BSTU?retryWrites=true&w=majority';

let queries = new Map();

db.MongoClient.connect(url).then(client => {
    let db = client.db();
    // db.collection('faculty').createIndex({FACULTY: 1}, {unique: true})
    // db.collection('pulpit').createIndex({PULPIT: 1}, {unique: true})
    queries.set('getFaculties', (onerror, onsuccess) => {
        db.collection('faculty').find({}).toArray()
            .then(result => onsuccess(result))
            .catch(err => onerror(err));
    });
    queries.set('getOneFaculty', (onerror, onsuccess, faculty) => {
        db.collection('faculty').find({FACULTY: faculty}).toArray()
            .then(result => onsuccess(result))
            .catch(err => onerror(err));
    });
    queries.set('addFaculties', (onerror, onsuccess, faculty) => {
        db.collection('faculty').insertOne({
            FACULTY: faculty.faculty,
            FACULTY_NAME: faculty.facultyName
        })
            .then(result => onsuccess(result.insertedId ? faculty : null))
            .catch(err => onerror(err));
    });
    queries.set('updateFaculties', (onerror, onsuccess, faculty) => {
        db.collection('faculty').findOneAndUpdate({FACULTY: faculty.faculty},
            {$set: {FACULTY: faculty.faculty, FACULTY_NAME: faculty.facultyName}})
            .then(result => onsuccess(result.value))
            .catch(err => onerror(err));
    });
    queries.set('deleteFaculties', (onerror, onsuccess, faculty) => {
        db.collection('faculty').findOneAndDelete({FACULTY: faculty})
            .then(result => onsuccess(result.value))
            .catch(err => onerror(err));
    });
    queries.set('getPulpits', (onerror, onsuccess) => {
        db.collection('pulpit').find({}).toArray()
            .then(result => onsuccess(result))
            .catch(err => onerror(err));
    });
    queries.set('getOnePulpit', (onerror, onsuccess, pulpit) => {
        db.collection('pulpit').find({PULPIT: pulpit}).toArray()
            .then(result => onsuccess(result))
            .catch(err => onerror(err));
    });
    queries.set('getPulpitsByFaculties', (onerror, onsuccess, faculties) => {
        db.collection('pulpit').find({FACULTY: {$regex: faculties}}).toArray()
            .then(result => onsuccess(result))
            .catch(err => onerror(err));
    });
    queries.set('addPulpits', (onerror, onsuccess, pulpit) => {
        db.collection('pulpit').insertOne({
            PULPIT: pulpit.pulpit,
            PULPIT_NAME: pulpit.pulpitName,
            FACULTY: pulpit.faculty
        })
            .then(result => onsuccess(result.insertedId ? pulpit : null))
            .catch(err => onerror(err));
    });
    queries.set('addPulpitsTransact', (onerror, onsuccess, pulpits) => {
        let session = client.startSession();
        session.withTransaction(() =>
            db.collection('pulpit').insertMany(pulpits.map(pulpit => ({
                PULPIT: pulpit.pulpit,
                PULPIT_NAME: pulpit.pulpitName,
                FACULTY: pulpit.faculty
            })), {session})
                .then(result => session.commitTransaction()
                    .then(d => onsuccess(result)))
                .catch(err => session.abortTransaction()
                    .then(d => onerror(err)))
                .finally(() => session.endSession()), {
            readConcern: {level: 'local'},
            writeConcern: {w: 'majority'}
        })
    });
    queries.set('updatePulpits', (onerror, onsuccess, pulpit) => {
        db.collection('pulpit').findOneAndUpdate({PULPIT: pulpit.pulpit},
            {$set: {PULPIT: pulpit.pulpit, PULPIT_NAME: pulpit.pulpitName, FACULTY: pulpit.faculty}})
            .then(result => onsuccess(result.value))
            .catch(err => onerror(err));
    });
    queries.set('deletePulpits', (onerror, onsuccess, pulpit) => {
        db.collection('pulpit').findOneAndDelete({PULPIT: pulpit})
            .then(result => onsuccess(result.value))
            .catch(err => onerror(err));
    });
}).catch(err => console.error(err))


let server = http.createServer((req, res) => {
        if (req.url.startsWith('/api') || req.url === '/transaction') {
            let query;
            let param;
            let url = require('url').parse(req.url).pathname.substring('/api'.length);
            if (req.url.startsWith('/api')) {
                if (req.method === 'GET') {
                    param = url.indexOf('/', 1) > 0 ? decodeURI(url.substring(url.indexOf('/', 1) + 1))
                        : (req.url.includes('?') ? require('url').parse(req.url, true).query.f.replace(',', '|') : null);
                    switch (url.substring(url.indexOf('/'), url.indexOf('/', 1) > 0 ? url.indexOf('/', 1) : url.length)) {
                        case '/faculties':
                            query = queries.get(url.indexOf('/', 1) > 0 ? 'getOneFaculty' : 'getFaculties');
                            break;
                        case '/pulpits':
                            query = queries.get(req.url.includes('?') ? 'getPulpitsByFaculties' : (url.indexOf('/', 1) > 0 ? 'getOnePulpit' : 'getPulpits'));
                            break;
                    }
                } else if (req.method === 'POST') {
                    switch (url) {
                        case '/faculties':
                            query = queries.get('addFaculties');
                            break;
                        case '/pulpits':
                            query = queries.get('addPulpits');
                            break;
                    }
                } else if (req.method === 'PUT') {
                    switch (url) {
                        case '/faculties':
                            query = queries.get('updateFaculties');
                            break;
                        case '/pulpits':
                            query = queries.get('updatePulpits');
                            break;
                    }
                } else if (req.method === 'DELETE') {
                    param = decodeURI(url.substring(url.indexOf('/', 1) + 1));
                    switch (
                        url.substring(url.indexOf('/'), url.indexOf('/', 1))) {
                        case '/faculties':
                            query = queries.get('deleteFaculties');
                            break;
                        case '/pulpits':
                            query = queries.get('deletePulpits');
                            break;
                    }
                }
            } else if (req.url === '/transaction')
                query = queries.get('addPulpitsTransact');
            let data = '';
            req.on('data', chunk => data += chunk);
            req.on('end', () => {
                if (query) {
                    query(err => {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end(err.message);
                    }, data => {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(data));
                    }, data.length > 0 ? JSON.parse(data) : param);
                } else {
                    res.writeHead(400, {'Content-Type': 'text/plain'});
                    res.end('Bad request');
                }
            });
        } else {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end('Bad request');
        }
    }
).listen(3000);