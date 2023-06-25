import express from 'express';
import bodyParser from 'body-parser';
import {engine} from 'express-handlebars';

let app = express();

app.engine('hbs', engine());
app.set('views', './views');
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended: false}));

import('./controller/employees.js').then(employees => app.use('/employees', employees.default));
import('./controller/offices.js').then(offices => app.use('/offices', offices.default));
import('./controller/jobs.js').then(jobs => app.use('/jobs', jobs.default));
import('./controller/jobtypes.js').then(jobtypes => app.use('/jobtypes', jobtypes.default));
import('./controller/professions.js').then(professions => app.use('/professions', professions.default));
import('./controller/vacancies.js').then(vacancies => app.use('/vacancies', vacancies.default));

app.listen(3000);