import {PrismaClient} from '@prisma/client';
import http from 'http';
import fs from 'fs';
import {parse as parseUrl} from 'url';

const client = new PrismaClient();

const models = {
    faculties: client.FACULTY,
    pulpits: client.PULPIT,
    subjects: client.SUBJECT,
    teachers: client.TEACHER,
    auditoriums: client.AUDITORIUM,
    auditoriumtypes: client.AUDITORIUM_TYPE
};

// client.AUDITORIUM.findMany().then(result =>
//     console.log(result)).then(async () =>
//     await client.$transaction(async transaction => {
//         await transaction.AUDITORIUM.updateMany({
//             data: {AUDITORIUM_CAPACITY: {increment: 100}}
//         })
//         console.log(await transaction.AUDITORIUM.findMany());
//         throw Error('Rollback');
//     }).catch(async err =>
//         console.log(await client.AUDITORIUM.findMany())).then(async () =>
//         console.log(await client.FACULTY.findUnique({
//                 where: {FACULTY: 'ИЭФ'}
//             }).Pulpits()
//         ))
// );

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
                    let url = parseUrl(req.url).pathname.substring('/api'.length);
                    let page = parseUrl(req.url, true).query;
                    let paths = decodeURI(url.substring(1, url.length)).split('/');
                    let model = models[paths[0]];
                    let param = paths.length > 1 ? paths[1] : null;
                    let ext = models[paths[2]];
                    if (req.method === 'GET') {
                        if (model === client.FACULTY && ext === client.SUBJECT) {
                            model.findMany({
                                where: {
                                    [model.name]: param
                                },
                                select: {
                                    FACULTY: true,
                                    Pulpits: {
                                        select: {
                                            PULPIT: true,
                                            Subjects: {
                                                select: {
                                                    SUBJECT_NAME: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }).then(result => rsl(result))
                                .catch(err => rjc(err));
                        } else if (model === client.AUDITORIUM_TYPE && ext === client.AUDITORIUM) {
                            model.findMany({
                                where: {
                                    [model.name]: param
                                },
                                select: {
                                    AUDITORIUM_TYPE: true,
                                    Auditoriums: {
                                        select: {
                                            AUDITORIUM: true
                                        }
                                    }
                                }
                            }).then(result => rsl(result))
                                .catch(err => rjc(err));
                        } else if (model) {
                            model.findMany({
                                where: param ? {
                                    [model.name]: param
                                } : undefined,
                                select: model === client.PULPIT ? {
                                    PULPIT: true,
                                    PULPIT_NAME: true,
                                    FACULTY: true,
                                    _count: true
                                } : undefined,
                                skip: page.number && page.size ? (page.number - 1) * page.size : undefined,
                                take: page.size ? page.size * 1 : undefined
                            }).then(result => rsl(result))
                                .catch(err => rjc(err));
                        } else {
                            switch (url) {
                                case '/auditoriumsWithComp1':
                                    client.AUDITORIUM.findMany({
                                        where: {
                                            AUDITORIUM_NAME: {
                                                endsWith: '-1'
                                            },
                                            Auditorium_type: {
                                                is: {AUDITORIUM_TYPE: 'ЛБ-К'}
                                            }
                                        }
                                    }).then(result => rsl(result))
                                        .catch(err => rjc(err));
                                    break;
                                case '/puplitsWithoutTeachers':
                                    client.PULPIT.findMany({
                                        where: {
                                            Teachers: {
                                                none: {}
                                            }
                                        },
                                        include: {
                                            Teachers: true
                                        }
                                    }).then(result => rsl(result))
                                        .catch(err => rjc(err));
                                    break;
                                case '/pulpitsWithVladimir':
                                    client.PULPIT.findMany({
                                        where: {
                                            Teachers: {
                                                some: {
                                                    TEACHER_NAME: {
                                                        contains: 'Владимир'
                                                    }
                                                }
                                            }
                                        },
                                        include: {
                                            Teachers: true
                                        }
                                    }).then(result => rsl(result))
                                        .catch(err => rjc(err));
                                    break;
                                case '/auditoriumsSameCount':
                                    client.AUDITORIUM.groupBy({
                                            by: ['AUDITORIUM_TYPE', 'AUDITORIUM_CAPACITY'],
                                            _count: true
                                        }
                                    ).then(result => rsl(result))
                                        .catch(err => rjc(err));
                                    break;
                                default:
                                    res.writeHead(404);
                                    res.end('Not Found');
                            }
                        }
                    } else if (req.method === 'POST') {
                        let entity = JSON.parse(data);
                        model.create({
                            data: (model === client.FACULTY && entity.Pulpits) || (model === client.PULPIT) ?
                                (model === client.FACULTY ? {
                                    FACULTY: entity.FACULTY,
                                    FACULTY_NAME: entity.FACULTY_NAME,
                                    Pulpits: {
                                        connectOrCreate: {
                                            where: {
                                                PULPIT: entity.Pulpits.PULPIT
                                            },
                                            create: entity.Pulpits
                                        }
                                    }
                                } : {
                                    PULPIT: entity.PULPIT,
                                    PULPIT_NAME: entity.PULPIT_NAME,
                                    Faculty: {
                                        connect: !entity.FACULTY_NAME ? {
                                            FACULTY: entity.FACULTY
                                        } : undefined,
                                        create: entity.FACULTY_NAME ? {
                                            FACULTY: entity.FACULTY,
                                            FACULTY_NAME: entity.FACULTY_NAME
                                        } : undefined
                                    }
                                })
                                : entity,
                        }).then(result => rsl(result))
                            .catch(err => rjc(err));
                    } else if (req.method === 'PUT') {
                        model.update({
                            data: JSON.parse(data),
                            where: {[model.name]: param}
                        }).then(result => rsl(result))
                            .catch(err => rjc(err));
                    } else if (req.method === 'DELETE') {
                        model.delete({
                            where: {[model.name]: param}
                        }).then(result => rsl(result))
                            .catch(err => rjc(err));
                    }
                }
            );
        } else {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end('Bad request');
        }
    }
).listen(3000);