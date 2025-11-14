use safework;

create table if not exists empresas (
    id int primary key not null,
    nome varchar(70) not null,
    rep varchar(120) not null,
    cnpj char(14) not null,
    senha varchar(255) not null,
    email varchar(255) unique not null,
    telefone int(9)
    enderecoEmp varchar(255) null,
);

foreign key (enderecoEmp) references endereco(id)