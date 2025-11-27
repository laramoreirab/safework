use safework;

delimiter //
create trigger atualiza_total_deletado
after delete on itens_pedidos
for each row
begin
    update pedidos
    set total =  (
        SELECT SUM(quantidade * preco_unitario)
        FROM itens_pedidos
        WHERE pedido_id = OLD.pedido_id
    )
    where id = OLD.pedido_id;
end;
//
delimiter ;