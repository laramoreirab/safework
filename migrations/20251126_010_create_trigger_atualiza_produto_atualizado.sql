use safework;

-- trigger para atualizar o total da compra caso mais unidade de um produto sejam adicionadas ou retiradas no pedido
delimiter //
create trigger atualiza_total_atualizado
after update on itens_pedidos
for each row
begin
    update pedidos
    set total = (select sum(quantidade*preco_unitario) from itens_pedidos)
    where id = new.pedido_id;
end;
//
delimiter ;