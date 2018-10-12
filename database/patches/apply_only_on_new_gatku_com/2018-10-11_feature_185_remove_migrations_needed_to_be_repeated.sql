
DELETE FROM forge.migrations
WHERE migration IN (
    '2018_08_21_225145_add_fields_to_table_orders',
    '2018_10_02_195422_add_columns_1_to_table_order_item_addons'
    );

/*
SELECT * FROM forge.migrations
WHERE migration IN (
    '2018_08_21_225145_add_fields_to_table_orders',
    '2018_10_02_195422_add_columns_1_to_table_order_item_addons'
    );
*/