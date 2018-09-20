
-- Remove all records from table: 'home_settings' exempt last one
DELETE FROM forge.home_settings WHERE id <> 145;

-- Update image urls in table: 'home_settings'
UPDATE forge.home_settings target
INNER JOIN forge.home_settings source ON target.id = source.id
SET target.image = REPLACE(source.image, 'http://cristspears.gatku.com/', 'https://cristspears.com/'),
    target.mobile_image = REPLACE(source.mobile_image, 'http://cristspears.gatku.com/', 'https://cristspears.com/'),
    target.logo = REPLACE(source.logo, 'http://cristspears.gatku.com/', 'https://cristspears.com/'),
    target.contact_image = REPLACE(source.contact_image, 'http://cristspears.gatku.com/', 'https://cristspears.com/'),
    target.contact_desktop_logo_url = REPLACE(source.contact_desktop_logo_url, 'http://cristspears.gatku.com/', 'https://cristspears.com/'),
    target.contact_mobile_logo_url = REPLACE(source.contact_mobile_logo_url, 'http://cristspears.gatku.com/', 'https://cristspears.com/'),
    target.top_stripe_background_image_url = REPLACE(source.top_stripe_background_image_url, 'http://cristspears.gatku.com/', 'https://cristspears.com/'),
    target.top_stripe_logo_url = REPLACE(source.top_stripe_logo_url, 'http://cristspears.gatku.com/', 'https://cristspears.com/');



-- Update urls in table: 'products'
UPDATE forge.products target
INNER JOIN forge.products source ON target.id = source.id
SET target.attachedImage = REPLACE(source.attachedImage, 'http://cristspears.gatku.com/', 'https://cristspears.com/'),
    target.detachedImage = REPLACE(source.detachedImage, 'http://cristspears.gatku.com/', 'https://cristspears.com/'),
    target.thumb = REPLACE(source.thumb, 'http://cristspears.gatku.com/', 'https://cristspears.com/'),
    target.emailImage = REPLACE(source.emailImage, 'http://cristspears.gatku.com/', 'https://cristspears.com/');

-- Update urls in table: 'you_images'
UPDATE forge.you_images target
INNER JOIN forge.you_images source ON target.id = source.id
SET target.image = REPLACE(source.image, 'http://cristspears.gatku.com/', 'https://cristspears.com/');
