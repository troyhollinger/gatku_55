/* Populate free_shipping_html column for: gatku.com */

-- table: email_settings:
UPDATE products
SET free_shipping_html = '<span class="bold">Free Shipping</span> on orders over <span class="bold">$400</span> <span class="detail bold">USA + AU ONLY</span>'
WHERE id <> 1000;