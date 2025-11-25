use safework -- usar banco de dados

create table if not exists empresas (
    id int primary key not null auto_increment, -- chave primaria sem valor nulo
    nome varchar(70) not null,
    rep varchar(120), --não pode ser not null pois no registro não é necessário
    cnpj char(14), --não pode ser not null pois no registro não é necessário
    senha varchar(255) not null,
    email varchar(255) unique not null,
    telefone varchar(11),
    tipo char(20) not null --adicionado
);
