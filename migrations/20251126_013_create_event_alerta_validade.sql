set global event_scheduler = on;

create event alerta_validade
on schedule every 1 day
starts '2025-11-26 00:00:00'
ends '2026-12-31 00:00:00'
do
  select nome, validade, lote, data_compra
  from (itens_pedidos join produtos on produto_id = id)
  where validade <= curdate();8