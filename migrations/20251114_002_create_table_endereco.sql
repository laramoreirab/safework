use safework -- usar banco de dados

create table if not exists endereco( -- criar tabela endereço

    id int not null primary key auto_increment, -- chave primaria sem valor nulo e inteiro
    rua varchar(255) not null,
    bairro varchar(255) not null,
    estado varchar(2) not null,
    cidade varchar(225) not null,
    numero int not null,
    idEmp int null
);
