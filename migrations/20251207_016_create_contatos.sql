create table contatos (
id int not null primary key auto_increment, 
nome varchar(255) not null,
email varchar(255) not null,
telefone varchar (15) not null,
mensagem varchar(999) not null
);