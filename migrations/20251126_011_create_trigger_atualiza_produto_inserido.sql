use safework;

delimiter //
create trigger atualiza_total_adicionado
after insert on itens_pedidos
for each row
begin
    update pedidos
    set total = (
        SELECT SUM(quantidade * preco_unitario)
        FROM itens_pedidos
        WHERE pedido_id = NEW.pedido_id
    )
    where id = new.pedido_id;
end;
//
delimiter ;