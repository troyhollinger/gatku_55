/* This is query to get total of sell quantity for products */

SELECT *, (order_item_quantity + order_item_addons_quantity) AS total_quantity
FROM (
       SELECT p.id AS product_id,
              p.name AS product_name,
              IFNULL(sum(oi.quantity), 0) AS order_item_quantity,
              IFNULL(sum(oia.quantity), 0) AS order_item_addons_quantity
       FROM products p
              LEFT JOIN order_items oi ON oi.productId = p.id
              LEFT JOIN order_item_addons oia ON oia.productId = p.id
       GROUP BY p.id
     ) t
