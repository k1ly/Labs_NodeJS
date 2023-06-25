use auth;

drop table users;

create table users
(
    id       bigint primary key identity (1,1),
    username varchar(100) not null,
    password varchar(100) not null
);

select * from users;