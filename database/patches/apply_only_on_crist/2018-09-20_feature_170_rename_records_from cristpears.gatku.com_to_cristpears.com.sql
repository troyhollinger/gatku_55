
-- Remove all records from table: 'home_settings' exempt last one
DELETE FROM forge.home_settings WHERE id <> 145;


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
