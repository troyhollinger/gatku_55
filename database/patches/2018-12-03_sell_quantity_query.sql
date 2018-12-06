/* This is query to get total of sell quantity for products */

SELECT product_id,
       product_name,
       SUM(order_item_quantity) AS order_item_quantity,
       SUM(order_item_addons_quantity) AS order_item_addons_quantity,
       (SUM(order_item_quantity) + SUM(order_item_addons_quantity)) AS total_quantity
FROM (
            SELECT p.id AS product_id,
                   p.name AS product_name,
                   IFNULL(SUM(oi.quantity), 0) AS order_item_quantity,
                   0 AS order_item_addons_quantity
            FROM products p
                        LEFT JOIN order_items oi ON oi.productId = p.id
            GROUP BY p.id

            UNION ALL

            SELECT p.id AS product_id,
                   p.name AS product_name,
                   0 AS order_item_quantity,
                   IFNULL(SUM(oia.quantity), 0) AS  order_item_addons_quantity
            FROM products p
                        LEFT JOIN order_item_addons oia ON oia.productId = p.id
            GROUP BY p.id

     ) t
GROUP BY t.product_id, t.product_name
ORDER BY t.product_name;
