import sequelize from 'sequelize';

class Employee extends sequelize.Model {
}

class Office extends sequelize.Model {
}

class Job extends sequelize.Model {
}

class JobType extends sequelize.Model {
}

class Profession extends sequelize.Model {
}

class Vacancy extends sequelize.Model {
}

function initialize(seq) {
    Profession.init({
        id: {type: sequelize.BIGINT, primaryKey: true, autoIncrement: true},
        name: {type: sequelize.STRING, allowNull: false}
    }, {
        sequelize: seq,
        modelName: 'Profession',
        tableName: 'professions',
        timestamps: false
    })
    JobType.init({
        id: {type: sequelize.BIGINT, primaryKey: true, autoIncrement: true},
        name: {type: sequelize.STRING, allowNull: false},
        speciality: {type: sequelize.STRING, allowNull: false},
        profession: {type: sequelize.BIGINT, allowNull: true, references: {model: Profession, key: 'profession'}}
    }, {
        sequelize: seq,
        modelName: 'JobType',
        tableName: 'job_types',
        timestamps: false
    })
    Job.init({
        id: {type: sequelize.BIGINT, primaryKey: true, autoIncrement: true},
        title: {type: sequelize.STRING, allowNull: false},
        customer: {type: sequelize.SMALLINT, allowNull: false},
        deadline: {type: sequelize.DATE, allowNull: true},
        start: {type: sequelize.DATE, allowNull: true},
        finish: {type: sequelize.DATE, allowNull: true},
        price: {type: sequelize.DOUBLE, allowNull: false},
        type: {type: sequelize.BIGINT, allowNull: false, references: {model: JobType, key: 'type'}},
    }, {
        sequelize: seq,
        modelName: 'Job',
        tableName: 'jobs',
        timestamps: false,
        hooks: {
            beforeCreate(attributes, options) {
                console.log('------ Before Create ------');
            },
            afterCreate(attributes, options) {
                console.log('------ After Create ------');
            }
        }
    })
    Office.init({
        id: {type: sequelize.BIGINT, primaryKey: true, autoIncrement: true},
        title: {type: sequelize.STRING, allowNull: true},
        country: {type: sequelize.STRING, allowNull: false},
        city: {type: sequelize.STRING, allowNull: false},
        address: {type: sequelize.STRING, allowNull: false},
        capacity: {type: sequelize.INTEGER, allowNull: false}
    }, {
        sequelize: seq,
        modelName: 'Office',
        tableName: 'offices',
        timestamps: false,
        scopes: {
            officesByCapacity: {
                where: {
                    capacity: {
                        [sequelize.Op.and]: {[sequelize.Op.gt]: 100, [sequelize.Op.lt]: 600}
                    }
                }
            }
        }
    })
    Vacancy.init({
        id: {type: sequelize.BIGINT, primaryKey: true, autoIncrement: true},
        capacity: {type: sequelize.INTEGER, allowNull: false},
        profession: {type: sequelize.BIGINT, allowNull: false, references: {model: Profession, key: 'profession'}},
        office: {type: sequelize.BIGINT, allowNull: false, references: {model: Office, key: 'office'}},
    }, {
        sequelize: seq,
        modelName: 'Vacancy',
        tableName: 'vacancies',
        timestamps: false
    })
    Employee.init({
        id: {type: sequelize.BIGINT, primaryKey: true, autoIncrement: true},
        name: {type: sequelize.STRING, allowNull: false},
        age: {type: sequelize.SMALLINT, allowNull: false},
        exp: {type: sequelize.SMALLINT, allowNull: false},
        email: {type: sequelize.STRING, allowNull: false},
        manager: {type: sequelize.BIGINT, allowNull: true, references: {model: Employee, key: 'manager'}},
        vacancy: {type: sequelize.BIGINT, allowNull: false, references: {model: Vacancy, key: 'vacancy'}}
    }, {
        sequelize: seq,
        modelName: 'Employee',
        tableName: 'employees',
        timestamps: false
    })
    Employee.hasMany(Employee, {foreignKey: 'manager'});
    Employee.belongsTo(Employee, {foreignKey: 'manager'});
    Profession.hasMany(Vacancy, {foreignKey: 'profession'});
    Vacancy.belongsTo(Profession, {foreignKey: 'profession'});
    Office.hasMany(Vacancy, {foreignKey: 'office'});
    Vacancy.belongsTo(Office, {foreignKey: 'office'});
    Vacancy.hasMany(Employee, {foreignKey: 'vacancy'});
    Employee.belongsTo(Vacancy, {foreignKey: 'vacancy'});
    JobType.hasMany(Job, {foreignKey: 'type'});
    Job.belongsTo(JobType, {foreignKey: 'type'});
    Profession.hasMany(JobType, {foreignKey: 'profession'});
    JobType.belongsTo(Profession, {foreignKey: 'profession'});
}

function init(seq) {
    initialize(seq);
    return {Employee, Office, Job, JobType, Profession, Vacancy};
}

export {init};