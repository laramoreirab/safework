use safework;

create table if not exists enderecoEmp(

    id int not null primary key,
    rua varchar(255) not null,
    bairro varchar(255) not null,
    estado varchar(2) not null,
    cidade varchar(225) not null,
    numero int not null
);
