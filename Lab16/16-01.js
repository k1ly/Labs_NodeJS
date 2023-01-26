const http = require('http');
const sql = require('mssql');
const fs = require('fs');
const {graphql, buildSchema} = require('graphql');

let config = {
    user: 'sa', password: 'Kirill1203', server: '127.0.0.1', database: 'University', trustServerCertificate: true,
    pool: {min: 4, max: 10, idleTimeoutMillis: 10000}
}

function DB(callback) {
    let connectionPool = new sql.ConnectionPool(config, err => {
        if (err)
            console.error(err);
        else {
            this.getFaculties = faculty => {
                let resolve = result => {
                    let data = [];
                    for (let i = 0; i < result.rowsAffected[0]; i++) {
                        let row = {}
                        for (let key in result.recordset[i]) {
                            row[key] = result.recordset[i][key];
                        }
                        let toPulpit = row => ({
                            PULPIT: row.PULPIT,
                            PULPIT_NAME: row.PULPIT_NAME
                        });
                        let toFaculty = row => ({
                            FACULTY: row.FACULTY,
                            FACULTY_NAME: row.FACULTY_NAME,
                            Pulpits: row.PULPIT && row.PULPIT_NAME ?
                                [toPulpit(row)] : []
                        });
                        let faculty = data.find(el => el.FACULTY === row.FACULTY);
                        if (faculty)
                            faculty.Pulpits = [...faculty.Pulpits, toPulpit(row)];
                        else data.push(toFaculty(row));
                    }
                    return data;
                }
                if (faculty)
                    return connectionPool.request()
                        .input('faculty', sql.NChar(10), faculty)
                        .query('select F.FACULTY,F.FACULTY_NAME,P.PULPIT,P.PULPIT_NAME from FACULTY F left join PULPIT P on F.FACULTY=P.FACULTY where F.FACULTY=@faculty').then(resolve)
                else
                    return connectionPool.request().query('select F.FACULTY,F.FACULTY_NAME,P.PULPIT,P.PULPIT_NAME from FACULTY F left join PULPIT P on F.FACULTY=P.FACULTY').then(resolve)
            }
            this.setFaculty = faculty => {
                let resolve = result => result.rowsAffected[0] > 0 ? {
                    FACULTY: faculty.faculty,
                    FACULTY_NAME: faculty.facultyName
                } : null;
                return connectionPool.request()
                    .input('faculty', sql.NChar(10), faculty.faculty)
                    .query('select * from FACULTY where FACULTY=@faculty').then(result => {
                        if (result.rowsAffected[0] > 0) {
                            return connectionPool.request()
                                .input('faculty', sql.NChar(10), faculty.faculty)
                                .input('faculty_name', sql.NVarChar, faculty.facultyName)
                                .query('update FACULTY set FACULTY_NAME=@faculty_name where FACULTY=@faculty').then(resolve);
                        } else {
                            return connectionPool.request()
                                .input('faculty', sql.NChar(10), faculty.faculty)
                                .input('faculty_name', sql.NVarChar, faculty.facultyName)
                                .query('insert into FACULTY(FACULTY,FACULTY_NAME) values (@faculty,@faculty_name)').then(resolve);
                        }
                    });
            }
            this.delFaculty = faculty => {
                return connectionPool.request()
                    .input('faculty', sql.NChar(10), faculty)
                    .query('select * from FACULTY where FACULTY=@faculty').then(result => {
                        if (result.rowsAffected[0] > 0) {
                            return connectionPool.request()
                                .input('faculty', sql.NChar(10), faculty)
                                .query('delete from FACULTY where FACULTY=@faculty')
                                .then(result => result.rowsAffected[0] > 0);
                        } else return false;
                    });
            }
            this.getPulpits = pulpit => {
                let resolve = result => {
                    let data = [];
                    for (let i = 0; i < result.rowsAffected[0]; i++) {
                        let row = {}
                        for (let key in result.recordset[i]) {
                            row[key] = result.recordset[i][key];
                        }
                        let toPulpit = row => ({
                            PULPIT: row.PULPIT,
                            PULPIT_NAME: row.PULPIT_NAME,
                            FACULTY: row.FACULTY
                        });
                        data.push(toPulpit(row));
                    }
                    return data;
                }
                if (pulpit)
                    return connectionPool.request()
                        .input('pulpit', sql.NChar(10), pulpit)
                        .query('select P.PULPIT,P.PULPIT_NAME,P.FACULTY from PULPIT P where P.PULPIT=@pulpit join ').then(resolve)
                else
                    return connectionPool.request().query('select P.PULPIT,P.PULPIT_NAME,P.FACULTY from PULPIT P').then(resolve)
            }
            this.setPulpit = pulpit => {
                let resolve = result => result.rowsAffected[0] > 0 ? {
                    PULPIT: pulpit.pulpit,
                    PULPIT_NAME: pulpit.pulpitName
                } : null;
                return connectionPool.request()
                    .input('pulpit', sql.NChar(10), pulpit.pulpit)
                    .query('select * from PULPIT where PULPIT=@pulpit').then(result => {
                        if (result.rowsAffected[0] > 0) {
                            return connectionPool.request()
                                .input('pulpit', sql.NChar(10), pulpit.pulpit)
                                .input('pulpit_name', sql.NVarChar, pulpit.pulpitName)
                                .input('faculty', sql.NChar(10), pulpit.faculty)
                                .query('update PULPIT set PULPIT_NAME=@pulpit_name, FACULTY=@faculty where PULPIT=@pulpit').then(resolve);
                        } else {
                            return connectionPool.request()
                                .input('pulpit', sql.NChar(10), pulpit.pulpit)
                                .input('pulpit_name', sql.NVarChar, pulpit.pulpitName)
                                .input('faculty', sql.NChar(10), pulpit.faculty)
                                .query('insert into PULPIT(PULPIT,PULPIT_NAME,FACULTY) values (@pulpit,@pulpit_name,@faculty)').then(resolve);
                        }
                    });
            }
            this.delPulpit = pulpit => {
                return connectionPool.request()
                    .input('pulpit', sql.NChar(10), pulpit)
                    .query('select * from PULPIT where PULPIT=@pulpit').then(result => {
                        if (result.rowsAffected[0] > 0) {
                            return connectionPool.request()
                                .input('pulpit', sql.NChar(10), pulpit)
                                .query('delete from PULPIT where PULPIT=@pulpit')
                                .then(result => result.rowsAffected[0] > 0);
                        } else return false;
                    });
            }
            this.getTeachers = teacher => {
                let resolve = result => {
                    let data = [];
                    for (let i = 0; i < result.rowsAffected[0]; i++) {
                        let row = {}
                        for (let key in result.recordset[i]) {
                            row[key] = result.recordset[i][key];
                        }
                        let toTeacher = row => ({
                            TEACHER: row.TEACHER,
                            TEACHER_NAME: row.TEACHER_NAME,
                            PULPIT: row.PULPIT
                        });
                        data.push(toTeacher(row));
                    }
                    return data;
                }
                if (teacher)
                    return connectionPool.request()
                        .input('teacher', sql.NChar(10), teacher)
                        .query('select T.TEACHER,T.TEACHER_NAME,T.PULPIT from TEACHER T where T.TEACHER=@teacher').then(resolve)
                else
                    return connectionPool.request().query('select T.TEACHER,T.TEACHER_NAME,T.PULPIT from TEACHER T').then(resolve)
            }
            this.getTeachersByFaculty = faculty => {
                let resolve = result => {
                    let data = [];
                    for (let i = 0; i < result.rowsAffected[0]; i++) {
                        let row = {}
                        for (let key in result.recordset[i]) {
                            row[key] = result.recordset[i][key];
                        }
                        let toTeacher = row => ({
                            TEACHER: row.TEACHER,
                            TEACHER_NAME: row.TEACHER_NAME,
                            PULPIT: row.PULPIT
                        });
                        data.push(toTeacher(row));
                    }
                    return data;
                }
                return connectionPool.request()
                    .input('faculty', sql.NChar(10), faculty)
                    .query('select T.TEACHER,T.TEACHER_NAME,T.PULPIT from TEACHER T ' +
                        'join PULPIT P on T.PULPIT = P.PULPIT where P.FACULTY=@faculty').then(resolve);
            }
            this.setTeacher = teacher => {
                let resolve = result => result.rowsAffected[0] > 0 ? {
                    TEACHER: teacher.teacher,
                    TEACHER_NAME: teacher.teacherName
                } : null;
                return connectionPool.request()
                    .input('teacher', sql.NChar(10), teacher.teacher)
                    .query('select * from TEACHER where TEACHER=@teacher').then(result => {
                        if (result.rowsAffected[0] > 0) {
                            return connectionPool.request()
                                .input('teacher', sql.NChar(10), teacher.teacher)
                                .input('teacher_name', sql.NVarChar, teacher.teacherName)
                                .input('pulpit', sql.NChar(10), teacher.pulpit)
                                .query('update TEACHER set TEACHER_NAME=@teacher_name,PULPIT=@pulpit where TEACHER=@teacher').then(resolve);
                        } else {
                            return connectionPool.request()
                                .input('teacher', sql.NChar(10), teacher.teacher)
                                .input('teacher_name', sql.NVarChar, teacher.teacherName)
                                .input('pulpit', sql.NChar(10), teacher.pulpit)
                                .query('insert into TEACHER(TEACHER,TEACHER_NAME,PULPIT) values (@teacher,@teacher_name,@pulpit)').then(resolve);
                        }
                    });
            }
            this.delTeacher = teacher => {
                return connectionPool.request()
                    .input('teacher', sql.NChar(10), teacher)
                    .query('select * from TEACHER where TEACHER=@teacher').then(result => {
                        if (result.rowsAffected[0] > 0) {
                            return connectionPool.request()
                                .input('teacher', sql.NChar(10), teacher)
                                .query('delete from TEACHER where TEACHER=@teacher')
                                .then(result => result.rowsAffected[0] > 0);
                        } else return false;
                    });
            }
            this.getSubjects = subject => {
                let resolve = result => {
                    let data = [];
                    for (let i = 0; i < result.rowsAffected[0]; i++) {
                        let row = {}
                        for (let key in result.recordset[i]) {
                            row[key] = result.recordset[i][key];
                        }
                        let toSubject = row => ({
                            SUBJECT: row.SUBJECT,
                            SUBJECT_NAME: row.SUBJECT_NAME,
                            PULPIT: row.PULPIT
                        });
                        data.push(toSubject(row));
                    }
                    return data;
                }
                if (subject)
                    return connectionPool.request()
                        .input('subject', sql.NChar(10), subject)
                        .query('select S.SUBJECT,S.SUBJECT_NAME,S.PULPIT from SUBJECT S where S.SUBJECT=@subject').then(resolve)
                else
                    return connectionPool.request().query('select S.SUBJECT,S.SUBJECT_NAME,S.PULPIT from SUBJECT S').then(resolve)
            }
            this.getSubjectsByFaculty = faculty => {
                let resolve = result => {
                    let data = [];
                    for (let i = 0; i < result.rowsAffected[0]; i++) {
                        let row = {}
                        for (let key in result.recordset[i]) {
                            row[key] = result.recordset[i][key];
                        }
                        let toSubject = row => ({
                            SUBJECT: row.SUBJECT,
                            SUBJECT_NAME: row.SUBJECT_NAME,
                            PULPIT: row.PULPIT
                        });
                        data.push(toSubject(row));
                    }
                    return data;
                }
                return connectionPool.request()
                    .input('faculty', sql.NChar(10), faculty)
                    .query('select S.SUBJECT,S.SUBJECT_NAME,S.PULPIT from SUBJECT S ' +
                        'join PULPIT P on S.PULPIT = P.PULPIT where P.FACULTY=@faculty').then(resolve);
            }
            this.setSubject = subject => {
                let resolve = result => result.rowsAffected[0] > 0 ? {
                    SUBJECT: subject.subject,
                    SUBJECT_NAME: subject.subjectName
                } : null;
                return connectionPool.request()
                    .input('subject', sql.NChar(10), subject.subject)
                    .query('select * from SUBJECT where SUBJECT=@subject').then(result => {
                        if (result.rowsAffected[0] > 0) {
                            return connectionPool.request()
                                .input('subject', sql.NChar(10), subject.subject)
                                .input('subject_name', sql.NVarChar, subject.subjectName)
                                .input('pulpit', sql.NChar(10), subject.pulpit)
                                .query('update SUBJECT set SUBJECT_NAME=@subject_name,PULPIT=@pulpit where SUBJECT=@subject').then(resolve);
                        } else {
                            return connectionPool.request()
                                .input('subject', sql.NChar(10), subject.subject)
                                .input('subject_name', sql.NVarChar, subject.subjectName)
                                .input('pulpit', sql.NChar(10), subject.pulpit)
                                .query('insert into SUBJECT(SUBJECT,SUBJECT_NAME,PULPIT) values (@subject,@subject_name,@pulpit)').then(resolve);
                        }
                    });
            }
            this.delSubject = subject => {
                return connectionPool.request()
                    .input('subject', sql.NChar(10), subject)
                    .query('select * from SUBJECT where SUBJECT=@subject').then(result => {
                        if (result.rowsAffected[0] > 0) {
                            return connectionPool.request()
                                .input('subject', sql.NChar(10), subject)
                                .query('delete from SUBJECT where SUBJECT=@subject')
                                .then(result => result.rowsAffected[0] > 0);
                        } else return false;
                    });
            }
            callback();
        }
    })
}

let resolver = {
    getFaculties: (args, context) => context.getFaculties(args.faculty),
    getPulpits: (args, context) => context.getPulpits(args.pulpit),
    getTeachers: (args, context) => context.getTeachers(args.teacher),
    getTeachersByFaculty: (args, context) => context.getTeachersByFaculty(args.faculty),
    getSubjects: (args, context) => context.getSubjects(args.subject),
    getSubjectsByFaculty: (args, context) => context.getSubjectsByFaculty(args.faculty),
    setFaculty: (args, context) => context.setFaculty(args.faculty),
    setPulpit: (args, context) => context.setPulpit(args.pulpit),
    setTeacher: (args, context) => context.setTeacher(args.teacher),
    setSubject: (args, context) => context.setSubject(args.subject),
    delFaculty: (args, context) => context.delFaculty(args.faculty),
    delPulpit: (args, context) => context.delPulpit(args.pulpit),
    delTeacher: (args, context) => context.delTeacher(args.teacher),
    delSubject: (args, context) => context.delSubject(args.subject)
}

let server = http.createServer();
let context = new DB(() => {
    server.listen(3000).on('request', (req, res) => {
        if (req.method === 'POST') {
            let data = '';
            req.on('data', chunk => data += chunk);
            req.on('end', () => {
                let json = JSON.parse(data);
                graphql(buildSchema(fs.readFileSync('schema.gql').toString()), json.query, resolver, context, json.variables)
                    .then(result => {
                        if (result.errors) {
                            res.writeHead(500, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(result.errors[0].message));
                        } else if (result.data) {
                            res.writeHead(200, {'Content-Type': 'application/json'});
                            res.end(JSON.stringify(result.data));
                        }
                    }).catch(err => console.error(err));
            });
        }
    });
});