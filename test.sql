-- SELECT p.name , p.description , c.total_price , ci.quantity
-- FROM carts AS c
-- INNER JOIN cart_items AS ci ON ci.cart_id = c.id
-- INNER JOIN products AS p ON p.id = ci.product_id
-- ;

-- 
SELECT * FROM order_items;


-- DELETE FROM carts where id =12;