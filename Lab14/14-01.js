const http = require('http');
const sql = require('mssql');
const fs = require('fs');

let config = {
    user: 'sa', password: 'Kirill1203', server: 'localhost', database: 'University', trustServerCertificate: true,
    pool: {min: 4, max: 10, idleTimeoutMillis: 10000}
}

let queries = new Map();
let connectionPool = new sql.ConnectionPool(config, err => {
    if (err)
        console.error(err);
    else {
        queries.set('getFaculties', (onerror, onsuccess) => {
            connectionPool.request().query('select * from FACULTY', (err, result) => {
                    if (err)
                        onerror(err);
                    else {
                        let data = [];
                        for (let i = 0; i < result.rowsAffected[0]; i++) {
                            let row = {}
                            for (let key in result.recordset[i]) {
                                row[key] = result.recordset[i][key];
                            }
                            data.push(row);
                        }
                        onsuccess(data);
                    }
                }
            )
        });
        queries.set('addFaculties', (onerror, onsuccess, faculty) => {
            connectionPool.request()
                .input('faculty', sql.NChar(10), faculty.faculty)
                .input('faculty_name', sql.NVarChar, faculty.facultyName)
                .query('insert into FACULTY(FACULTY,FACULTY_NAME) values (@faculty,@faculty_name)', (err, result) => {
                        if (err)
                            onerror('Факультет уже существует!');
                        else {
                            onsuccess(result.rowsAffected[0] > 0 ? faculty : null);
                        }
                    }
                )
        });
        queries.set('updateFaculties', (onerror, onsuccess, faculty) => {
            connectionPool.request()
                .input('faculty', sql.NChar(10), faculty.faculty)
                .input('faculty_name', sql.NVarChar, faculty.facultyName)
                .query('update FACULTY set FACULTY_NAME=@faculty_name where FACULTY=@faculty', (err, result) => {
                        if (err)
                            onerror(err);
                        else {
                            if (result.rowsAffected[0] === 0)
                                onerror('Несуществующий факультет!');
                            onsuccess(result.rowsAffected[0] > 0 ? faculty : null);
                        }
                    }
                )
        });
        queries.set('deleteFaculties', (onerror, onsuccess, faculty) => {
            connectionPool.request()
                .input('faculty', sql.NChar(10), faculty)
                .query('select * from FACULTY where FACULTY=@faculty', (err, result) => {
                        if (err)
                            onerror(err);
                        else {
                            if (result.rowsAffected[0] === 0)
                                onerror('Несуществующий факультет!');
                            let data = [];
                            for (let i = 0; i < result.rowsAffected[0]; i++) {
                                let row = {}
                                for (let key in result.recordset[i]) {
                                    row[key] = result.recordset[i][key];
                                }
                                data.push(row);
                            }
                            connectionPool.request()
                                .input('faculty', sql.NChar(10), faculty)
                                .query('delete from FACULTY where FACULTY=@faculty', (err, result) => {
                                        if (err)
                                            onerror(err);
                                        else {
                                            onsuccess(result.rowsAffected[0] === 1 ? data[0] : data);
                                        }
                                    }
                                )
                        }
                    }
                )
        });
        queries.set('getPulpits', (onerror, onsuccess) => {
            connectionPool.request().query('select * from PULPIT', (err, result) => {
                    if (err)
                        onerror(err);
                    else {
                        let data = [];
                        for (let i = 0; i < result.rowsAffected[0]; i++) {
                            let row = {}
                            for (let key in result.recordset[i]) {
                                row[key] = result.recordset[i][key];
                            }
                            data.push(row);
                        }
                        onsuccess(data);
                    }
                }
            )
        });
        queries.set('getFacultyPulpits', (onerror, onsuccess, faculty) => {
            connectionPool.request()
                .input('faculty', sql.NChar(10), faculty)
                .query('select * from PULPIT where FACULTY=@faculty', (err, result) => {
                        if (err)
                            onerror(err);
                        else {
                            let data = [];
                            for (let i = 0; i < result.rowsAffected[0]; i++) {
                                let row = {}
                                for (let key in result.recordset[i]) {
                                    row[key] = result.recordset[i][key];
                                }
                                data.push(row);
                            }
                            onsuccess(data);
                        }
                    }
                )
        });
        queries.set('addPulpits', (onerror, onsuccess, pulpit) => {
            connectionPool.request()
                .input('pulpit', sql.NChar(10), pulpit.pulpit)
                .input('pulpit_name', sql.NVarChar, pulpit.pulpitName)
                .input('faculty', sql.NChar(10), pulpit.faculty)
                .query('insert into PULPIT(PULPIT,PULPIT_NAME,FACULTY) values (@pulpit,@pulpit_name,@faculty)', (err, result) => {
                        if (err)
                            onerror('Кафедра уже существует!');
                        else {
                            onsuccess(result.rowsAffected[0] > 0 ? {
                                PULPIT: pulpit.pulpit,
                                PULPIT_NAME: pulpit.pulpitName,
                                FACULTY: pulpit.faculty
                            } : null);
                        }
                    }
                )
        });
        queries.set('updatePulpits', (onerror, onsuccess, pulpit) => {
            connectionPool.request()
                .input('pulpit', sql.NChar(10), pulpit.pulpit)
                .input('pulpit_name', sql.NVarChar, pulpit.pulpitName)
                .input('faculty', sql.NChar(10), pulpit.faculty)
                .query('update PULPIT set PULPIT_NAME=@pulpit_name,FACULTY=@faculty where PULPIT=@pulpit', (err, result) => {
                        if (err)
                            onerror(err.message);
                        else {
                            if (result.rowsAffected[0] === 0)
                                onerror('Несуществующая кафедра!');
                            else {
                                onsuccess(result.rowsAffected[0] > 0 ? {
                                    PULPIT: pulpit.pulpit,
                                    PULPIT_NAME: pulpit.pulpitName,
                                    FACULTY: pulpit.faculty
                                } : null);
                            }
                        }
                    }
                )
        });
        queries.set('deletePulpits', (onerror, onsuccess, pulpit) => {
            connectionPool.request()
                .input('pulpit', sql.NChar(10), pulpit)
                .query('select * from PULPIT where PULPIT=@pulpit', (err, result) => {
                        if (err)
                            onerror(err.message);
                        else {
                            if (result.rowsAffected[0] === 0)
                                onerror('Несуществующая кафедра!');
                            else {
                                let data = [];
                                for (let i = 0; i < result.rowsAffected[0]; i++) {
                                    let row = {}
                                    for (let key in result.recordset[i]) {
                                        row[key] = result.recordset[i][key];
                                    }
                                    data.push(row);
                                }
                                connectionPool.request()
                                    .input('pulpit', sql.NChar(10), pulpit)
                                    .query('delete from PULPIT where PULPIT=@pulpit', (err, result) => {
                                            if (err)
                                                onerror(err);
                                            else {
                                                onsuccess(result.rowsAffected[0] === 1 ? data[0] : data);
                                            }
                                        }
                                    )
                            }
                        }
                    }
                )
        });
        queries.set('getSubjects', (onerror, onsuccess) => {
            connectionPool.request().query('select * from SUBJECT', (err, result) => {
                    if (err)
                        onerror(err);
                    else {
                        let data = [];
                        for (let i = 0; i < result.rowsAffected[0]; i++) {
                            let row = {}
                            for (let key in result.recordset[i]) {
                                row[key] = result.recordset[i][key];
                            }
                            data.push(row);
                        }
                        onsuccess(data);
                    }
                }
            )
        });
        queries.set('addSubjects', (onerror, onsuccess, subject) => {
            connectionPool.request()
                .input('subject', sql.NChar(10), subject.subject)
                .input('subject_name', sql.NVarChar, subject.subjectName)
                .query('insert into SUBJECT(SUBJECT,SUBJECT_NAME) values (@subject,@subject_name)', (err, result) => {
                        if (err)
                            onerror(err);
                        else {
                            onsuccess(result.rowsAffected[0] > 0 ? subject : null);
                        }
                    }
                )
        });
        queries.set('updateSubjects', (onerror, onsuccess, subject) => {
            connectionPool.request()
                .input('subject', sql.NChar(10), subject.subject)
                .input('subject_name', sql.NVarChar, subject.subjectName)
                .query('update SUBJECT set SUBJECT_NAME=@subject_name where SUBJECT=@subject', (err, result) => {
                        if (err)
                            onerror(err);
                        else {
                            onsuccess(result.rowsAffected[0] > 0 ? subject : null);
                        }
                    }
                )
        });
        queries.set('deleteSubjects', (onerror, onsuccess, subject) => {
            connectionPool.request()
                .input('subject', sql.NChar(10), subject)
                .query('select * from SUBJECT where SUBJECT=@subject', (err, result) => {
                        if (err)
                            onerror(err);
                        else {
                            let data = [];
                            for (let i = 0; i < result.rowsAffected[0]; i++) {
                                let row = {}
                                for (let key in result.recordset[i]) {
                                    row[key] = result.recordset[i][key];
                                }
                                data.push(row);
                            }
                            connectionPool.request()
                                .input('subject', sql.NChar(10), subject)
                                .query('delete from SUBJECT where SUBJECT=@subject', (err, result) => {
                                        if (err)
                                            onerror(err);
                                        else {
                                            onsuccess(result.rowsAffected[0] === 1 ? data[0] : data);
                                        }
                                    }
                                )
                        }
                    }
                )
        });
        queries.set('getAuditoriums', (onerror, onsuccess) => {
            connectionPool.request().query('select * from AUDITORIUM', (err, result) => {
                    if (err)
                        onerror(err);
                    else {
                        let data = [];
                        for (let i = 0; i < result.rowsAffected[0]; i++) {
                            let row = {}
                            for (let key in result.recordset[i]) {
                                row[key] = result.recordset[i][key];
                            }
                            data.push(row);
                        }
                        onsuccess(data);
                    }
                }
            )
        });
        queries.set('addAuditoriums', (onerror, onsuccess, auditorium) => {
            connectionPool.request()
                .input('auditorium', sql.NChar(10), auditorium.auditorium)
                .input('auditorium_name', sql.NVarChar, auditorium.auditoriumName)
                .query('insert into AUDITORIUM(AUDITORIUM,AUDITORIUM_NAME) values (@auditorium,@auditorium_name)', (err, result) => {
                        if (err)
                            onerror(err);
                        else {
                            onsuccess(result.rowsAffected[0] > 0 ? auditorium : null);
                        }
                    }
                )
        });
        queries.set('updateAuditoriums', (onerror, onsuccess, auditorium) => {
            connectionPool.request()
                .input('auditorium', sql.NChar(10), auditorium.auditorium)
                .input('auditorium_name', sql.NVarChar, auditorium.auditoriumName)
                .query('update AUDITORIUM set AUDITORIUM_NAME=@auditorium_name where AUDITORIUM=@auditorium', (err, result) => {
                        if (err)
                            onerror(err);
                        else {
                            onsuccess(result.rowsAffected[0] > 0 ? auditorium : null);
                        }
                    }
                )
        });
        queries.set('deleteAuditoriums', (onerror, onsuccess, auditorium) => {
            connectionPool.request()
                .input('auditorium', sql.NChar(10), auditorium)
                .query('select * from AUDITORIUM where AUDITORIUM=@auditorium', (err, result) => {
                        if (err)
                            onerror(err);
                        else {
                            let data = [];
                            for (let i = 0; i < result.rowsAffected[0]; i++) {
                                let row = {}
                                for (let key in result.recordset[i]) {
                                    row[key] = result.recordset[i][key];
                                }
                                data.push(row);
                            }
                            connectionPool.request()
                                .input('auditorium', sql.NChar(10), auditorium)
                                .query('delete from AUDITORIUM where AUDITORIUM=@auditorium', (err, result) => {
                                        if (err)
                                            onerror(err);
                                        else {
                                            onsuccess(result.rowsAffected[0] === 1 ? data[0] : data);
                                        }
                                    }
                                )
                        }
                    }
                )
        });
        queries.set('getAuditoriumstypes', (onerror, onsuccess) => {
            connectionPool.request().query('select * from AUDITORIUM_TYPE', (err, result) => {
                    if (err)
                        onerror(err);
                    else {
                        let data = [];
                        for (let i = 0; i < result.rowsAffected[0]; i++) {
                            let row = {}
                            for (let key in result.recordset[i]) {
                                row[key] = result.recordset[i][key];
                            }
                            data.push(row);
                        }
                        onsuccess(data);
                    }
                }
            )
        });
        queries.set('addAuditoriumstypes', (onerror, onsuccess, audtype) => {
            connectionPool.request()
                .input('audtype', sql.NChar(10), audtype.audtype)
                .input('audtype_name', sql.NVarChar, audtype.audtypeName)
                .query('insert into AUDITORIUM_TYPE(AUDITORIUM_TYPE,AUDITORIUM_TYPENAME) values (@audtype,@audtype_name)', (err, result) => {
                        if (err)
                            onerror(err);
                        else {
                            onsuccess(result.rowsAffected[0] > 0 ? audtype : null);
                        }
                    }
                )
        });
        queries.set('updateAuditoriumstypes', (onerror, onsuccess, audtype) => {
            connectionPool.request()
                .input('audtype', sql.NChar(10), audtype.audtype)
                .input('audtype_name', sql.NVarChar, audtype.audtypeName)
                .query('update AUDITORIUM_TYPE set AUDITORIUM_TYPENAME=@audtype_name where AUDITORIUM_TYPE=@audtype', (err, result) => {
                        if (err)
                            onerror(err);
                        else {
                            onsuccess(result.rowsAffected[0] > 0 ? audtype : null);
                        }
                    }
                )
        });
        queries.set('deleteAuditoriumstypes', (onerror, onsuccess, audtype) => {
            connectionPool.request()
                .input('audtype', sql.NChar(10), audtype)
                .query('select * from AUDITORIUM_TYPE where AUDITORIUM_TYPE=@audtype', (err, result) => {
                        if (err)
                            onerror(err);
                        else {
                            let data = [];
                            for (let i = 0; i < result.rowsAffected[0]; i++) {
                                let row = {}
                                for (let key in result.recordset[i]) {
                                    row[key] = result.recordset[i][key];
                                }
                                data.push(row);
                            }
                            connectionPool.request()
                                .input('audtype', sql.NChar(10), audtype)
                                .query('delete from AUDITORIUM_TYPE where AUDITORIUM_TYPE=@audtype', (err, result) => {
                                        if (err)
                                            onerror(err);
                                        else {
                                            onsuccess(result.rowsAffected[0] === 1 ? data[0] : data);
                                        }
                                    }
                                )
                        }
                    }
                )
        });
    }
})

let server = http.createServer((req, res) => {
        if (req.method === 'GET' && req.url === '/') {
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            res.end(fs.readFileSync('index.html'));
        } else if (req.url.startsWith('/api')) {
            let url = require('url').parse(req.url).pathname.substring('/api'.length);
            let query;
            let param;
            if (req.method === 'GET') {
                param = url.indexOf('/', 1) > 0 ? decodeURI(url.substring(url.indexOf('/', 1) + 1, url.indexOf('/', url.indexOf('/', 1) + 1))) : null;
                switch (url.substring(url.indexOf('/'), url.indexOf('/', 1) > 0 ? url.indexOf('/', 1) : url.length)) {
                    case '/faculties':
                        query = queries.get(url.indexOf('/', 1) > 0 && url.substring(url.indexOf('/', url.indexOf('/', 1) + 1)) === '/pulpits' ?
                            'getFacultyPulpits' : 'getFaculties');
                        break;
                    case '/pulpits':
                        query = queries.get('getPulpits');
                        break;
                    case '/subjects':
                        query = queries.get('getSubjects');
                        break;
                    case '/auditoriumstypes':
                        query = queries.get('getAuditoriumstypes');
                        break;
                    case '/auditoriums':
                        query = queries.get('getAuditoriums');
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
                    case '/subjects':
                        query = queries.get('addSubjects');
                        break;
                    case '/auditoriumstypes':
                        query = queries.get('addAuditoriumstypes');
                        break;
                    case '/auditoriums':
                        query = queries.get('addAuditoriums');
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
                    case '/subjects':
                        query = queries.get('updateSubjects');
                        break;
                    case '/auditoriumstypes':
                        query = queries.get('updateAuditoriumstypes');
                        break;
                    case '/auditoriums':
                        query = queries.get('updateAuditoriums');
                        break;
                }
            } else if (req.method === 'DELETE') {
                param = decodeURI(url.substring(url.indexOf('/', 1) + 1));
                switch (url.substring(url.indexOf('/'), url.indexOf('/', 1))) {
                    case '/faculties':
                        query = queries.get('deleteFaculties');
                        break;
                    case '/pulpits':
                        query = queries.get('deletePulpits');
                        break;
                    case '/subjects':
                        query = queries.get('deleteSubjects');
                        break;
                    case '/auditoriumstypes':
                        query = queries.get('deleteAuditoriumstypes');
                        break;
                    case '/auditoriums':
                        query = queries.get('deleteAuditoriums');
                        break;
                }
            }
            let data = '';
            req.on('data', chunk => data += chunk);
            req.on('end', () => {
                if (query) {
                    query(err => {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end(err);
                    }, data => {
                        res.writeHead(200, {'Content-Type': 'application/json'});
                        res.end(JSON.stringify(data));
                    }, data.length > 0 ? JSON.parse(data) : param);
                } else {
                    res.writeHead(400, {'Content-Type': 'text/plain'});
                    res.end('Bad request');
                }
            });
        } else if (req.method === 'GET' && req.url.endsWith('.js')) {
            res.writeHead(200, {'Content-Type': 'text/javascript'});
            res.end(fs.readFileSync(req.url.substring(1)));
        } else {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end('Bad request');
        }
    }
).listen(3000);