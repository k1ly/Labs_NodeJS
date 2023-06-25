use casl;

drop table commits;
drop table repos;
drop table users;

create table users
(
    id       bigint primary key identity (1,1),
    username varchar(100) not null,
    email    varchar(100) null,
    password varchar(100) not null,
    role     varchar(50)  not null check (role in ('ADMIN','CLIENT'))
);

create table repos
(
    id     bigint primary key identity (1,1),
    name   varchar(100) not null,
    author bigint       not null references users (id)
);

create table commits
(
    id      bigint primary key identity (1,1),
    message varchar(256) not null,
    repo    bigint       not null references repos (id)
);

insert into users(username, email, password, role)
values ('admin', 'admin@mail.com', '$2b$10$mp0uHPHLTTsAcfyGmwyWSOzCrUZdWH1lpWlDgjltWczCHv2nTs9AS', 'ADMIN');
insert into users(username, email, password, role)
values ('login1', 'client@mail.com', '$2b$10$mp0uHPHLTTsAcfyGmwyWSOzCrUZdWH1lpWlDgjltWczCHv2nTs9AS', 'CLIENT');
insert into users(username, email, password, role)
values ('login2', 'client@mail.com', '$2b$10$mp0uHPHLTTsAcfyGmwyWSOzCrUZdWH1lpWlDgjltWczCHv2nTs9AS', 'CLIENT');

select *
from users;
select *
from repos;
select *
from commits;