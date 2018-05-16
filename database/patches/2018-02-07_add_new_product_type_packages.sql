/* Feature/29 Add new product type packages */

INSERT INTO `forge`.`product_types`
(`id`,`name`,`slug`,`shippingPrice`, `created_at`, `updated_at`)
VALUES (0, 'Package', 'package', 2000, NOW(), NOW());

