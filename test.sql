-- SELECT p.name , p.description , c.total_price , ci.quantity
-- FROM carts AS c
-- INNER JOIN cart_items AS ci ON ci.cart_id = c.id
-- INNER JOIN products AS p ON p.id = ci.product_id
-- ;

-- DELETE FROM cart_items;
-- DELETE FROM carts;
-- SELECT * FROM  carts

SELECT * FROM carts;