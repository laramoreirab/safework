use safework;

delimiter //
create trigger atualiza_total_deletado
after delete on itens_pedidos
for each row
begin
    update pedidos
    set total = (select sum(quantidade*preco_unitario) from itens_pedidos)
    where id = new.pedido_id;
end;
//
delimiter ;