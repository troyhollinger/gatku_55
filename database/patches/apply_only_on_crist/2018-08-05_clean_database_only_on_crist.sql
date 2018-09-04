
-- Remove all orders and related records
DELETE FROM order_item_addons;
DELETE FROM order_items;
DELETE FROM shipping_requests;
DELETE FROM shipping_tracks;
DELETE FROM orders;

-- Remove all customers
DELETE FROM customers;

-- Remove all you_images
DELETE FROM you_images;

-- Remove all not used product on page.
DELETE FROM products
WHERE name IN (
    'Dinner Getter',
    'Blue Water',
    'Lionfish',
    'Inshore Shrinker',
    'Offshore Striker',
    'G-String',
    'Cable Kit',
    'Black Knife',
    'Extra Tip',
    'Cable',
    'BigGame',
    'FinFlashers',
    "9'ER",
    'SuperHero',
    'Comfort',
    'Signature Glass',
    'Barbed Glass',
    'Sliptip Glass',
    'Flopper Glass'
);