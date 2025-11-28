use safework

create table produtos (
id int not null primary key auto_increment,
nome varchar(255) not null,
preco int not null,
img varchar(255) null,
ca int not null,
marca varchar(255) not null,
tipo varchar(255) not null,
descricao varchar(999) not null,
estoque int not null
);