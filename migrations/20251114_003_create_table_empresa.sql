use safework -- usar banco de dados

create table if not exists empresas (
    id int primary key not null auto_increment, -- chave primaria sem valor nulo
    nome varchar(70) not null,
    rep varchar(120) not null,
    cnpj char(14) not null,
    senha varchar(255) not null,
    email varchar(255) unique not null,
    telefone varchar(11)
);

alter table endereco add foreign key (idEmp) references empresas(id); -- alterar a tabela endereco adicionando uma chave estrangeira que se refere ao id da tabela empresas