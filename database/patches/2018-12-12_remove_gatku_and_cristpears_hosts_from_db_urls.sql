/* Remove all gatku.com and cristpears.com hosts from db urls */

-- table: email_settings:
UPDATE email_settings 
SET email_main_logo_url = REPLACE(email_main_logo_url, 'https://gatku.com', ''),
    email_main_logo_url = REPLACE(email_main_logo_url, 'http://gatku.com', ''),
    email_main_logo_url = REPLACE(email_main_logo_url, 'https://cristspears.com', ''),
    email_main_logo_url = REPLACE(email_main_logo_url, 'http://cristspears.com', ''),
    email_main_logo_url = REPLACE(email_main_logo_url, 'https://qa.cristspears.com', ''),
    email_main_logo_url = REPLACE(email_main_logo_url, 'http://qa.cristspears.com', ''),

    email_small_logo_url = REPLACE(email_small_logo_url, 'https://gatku.com', ''),
    email_small_logo_url = REPLACE(email_small_logo_url, 'http://gatku.com', ''),
    email_small_logo_url = REPLACE(email_small_logo_url, 'https://cristspears.com', ''),
    email_small_logo_url = REPLACE(email_small_logo_url, 'http://cristspears.com', ''),
    email_small_logo_url = REPLACE(email_small_logo_url, 'https://qa.cristspears.com', ''),
    email_small_logo_url = REPLACE(email_small_logo_url, 'http://qa.cristspears.com', '');

-- table: home_settings:
UPDATE home_settings 
SET image = REPLACE(image, 'https://gatku.com', ''),
    image = REPLACE(image, 'http://gatku.com', ''),
    image = REPLACE(image, 'https://cristspears.com', ''),
    image = REPLACE(image, 'http://cristspears.com', ''),
    image = REPLACE(image, 'https://qa.cristspears.com', ''),
    image = REPLACE(image, 'http://qa.cristspears.com', ''),

    mobile_image = REPLACE(mobile_image, 'https://gatku.com', ''),
    mobile_image = REPLACE(mobile_image, 'http://gatku.com', ''),
    mobile_image = REPLACE(mobile_image, 'https://cristspears.com', ''),
    mobile_image = REPLACE(mobile_image, 'http://cristspears.com', ''),
    mobile_image = REPLACE(mobile_image, 'https://qa.cristspears.com', ''),
    mobile_image = REPLACE(mobile_image, 'http://qa.cristspears.com', ''),

    logo = REPLACE(logo, 'https://gatku.com', ''),
    logo = REPLACE(logo, 'http://gatku.com', ''),
    logo = REPLACE(logo, 'https://cristspears.com', ''),
    logo = REPLACE(logo, 'http://cristspears.com', ''),
    logo = REPLACE(logo, 'https://qa.cristspears.com', ''),
    logo = REPLACE(logo, 'http://qa.cristspears.com', ''),

    contact_image = REPLACE(contact_image, 'https://gatku.com', ''),
    contact_image = REPLACE(contact_image, 'http://gatku.com', ''),
    contact_image = REPLACE(contact_image, 'https://cristspears.com', ''),
    contact_image = REPLACE(contact_image, 'http://cristspears.com', ''),
    contact_image = REPLACE(contact_image, 'https://qa.cristspears.com', ''),
    contact_image = REPLACE(contact_image, 'http://qa.cristspears.com', ''),

    contact_desktop_logo_url = REPLACE(contact_desktop_logo_url, 'https://gatku.com', ''),
    contact_desktop_logo_url = REPLACE(contact_desktop_logo_url, 'http://gatku.com', ''),
    contact_desktop_logo_url = REPLACE(contact_desktop_logo_url, 'https://cristspears.com', ''),
    contact_desktop_logo_url = REPLACE(contact_desktop_logo_url, 'http://cristspears.com', ''),
    contact_desktop_logo_url = REPLACE(contact_desktop_logo_url, 'https://qa.cristspears.com', ''),
    contact_desktop_logo_url = REPLACE(contact_desktop_logo_url, 'http://qa.cristspears.com', ''),

    contact_mobile_logo_url = REPLACE(contact_mobile_logo_url, 'https://gatku.com', ''),
    contact_mobile_logo_url = REPLACE(contact_mobile_logo_url, 'http://gatku.com', ''),
    contact_mobile_logo_url = REPLACE(contact_mobile_logo_url, 'https://cristspears.com', ''),
    contact_mobile_logo_url = REPLACE(contact_mobile_logo_url, 'http://cristspears.com', ''),
    contact_mobile_logo_url = REPLACE(contact_mobile_logo_url, 'https://qa.cristspears.com', ''),
    contact_mobile_logo_url = REPLACE(contact_mobile_logo_url, 'http://qa.cristspears.com', ''),

    top_stripe_background_image_url = REPLACE(top_stripe_background_image_url, 'https://gatku.com', ''),
    top_stripe_background_image_url = REPLACE(top_stripe_background_image_url, 'http://gatku.com', ''),
    top_stripe_background_image_url = REPLACE(top_stripe_background_image_url, 'https://cristspears.com', ''),
    top_stripe_background_image_url = REPLACE(top_stripe_background_image_url, 'http://cristspears.com', ''),
    top_stripe_background_image_url = REPLACE(top_stripe_background_image_url, 'https://qa.cristspears.com', ''),
    top_stripe_background_image_url = REPLACE(top_stripe_background_image_url, 'http://qa.cristspears.com', ''),

    top_stripe_logo_url = REPLACE(top_stripe_logo_url, 'https://gatku.com', ''),
    top_stripe_logo_url = REPLACE(top_stripe_logo_url, 'http://gatku.com', ''),
    top_stripe_logo_url = REPLACE(top_stripe_logo_url, 'https://cristspears.com', ''),
    top_stripe_logo_url = REPLACE(top_stripe_logo_url, 'http://cristspears.com', ''),
    top_stripe_logo_url = REPLACE(top_stripe_logo_url, 'https://qa.cristspears.com', ''),
    top_stripe_logo_url = REPLACE(top_stripe_logo_url, 'http://qa.cristspears.com', ''),

    footer_banner_url = REPLACE(footer_banner_url, 'https://gatku.com', ''),
    footer_banner_url = REPLACE(footer_banner_url, 'http://gatku.com', ''),
    footer_banner_url = REPLACE(footer_banner_url, 'https://cristspears.com', ''),
    footer_banner_url = REPLACE(footer_banner_url, 'http://cristspears.com', ''),
    footer_banner_url = REPLACE(footer_banner_url, 'https://qa.cristspears.com', ''),
    footer_banner_url = REPLACE(footer_banner_url, 'http://qa.cristspears.com', '');


-- table: products:
UPDATE products 
SET attachedImage = REPLACE(attachedImage, 'https://gatku.com', ''),
    attachedImage = REPLACE(attachedImage, 'http://gatku.com', ''),
    attachedImage = REPLACE(attachedImage, 'https://cristspears.com', ''),
    attachedImage = REPLACE(attachedImage, 'http://cristspears.com', ''),
    attachedImage = REPLACE(attachedImage, 'https://qa.cristspears.com', ''),
    attachedImage = REPLACE(attachedImage, 'http://qa.cristspears.com', ''),

    detachedImage = REPLACE(detachedImage, 'https://gatku.com', ''),
    detachedImage = REPLACE(detachedImage, 'http://gatku.com', ''),
    detachedImage = REPLACE(detachedImage, 'https://cristspears.com', ''),
    detachedImage = REPLACE(detachedImage, 'http://cristspears.com', ''),
    detachedImage = REPLACE(detachedImage, 'https://qa.cristspears.com', ''),
    detachedImage = REPLACE(detachedImage, 'http://qa.cristspears.com', ''),

    thumb = REPLACE(thumb, 'https://gatku.com', ''),
    thumb = REPLACE(thumb, 'http://gatku.com', ''),
    thumb = REPLACE(thumb, 'https://cristspears.com', ''),
    thumb = REPLACE(thumb, 'http://cristspears.com', ''),
    thumb = REPLACE(thumb, 'https://qa.cristspears.com', ''),
    thumb = REPLACE(thumb, 'http://qa.cristspears.com', ''),

    emailImage = REPLACE(emailImage, 'https://gatku.com', ''),
    emailImage = REPLACE(emailImage, 'http://gatku.com', ''),
    emailImage = REPLACE(emailImage, 'https://cristspears.com', ''),
    emailImage = REPLACE(emailImage, 'http://cristspears.com', ''),
    emailImage = REPLACE(emailImage, 'https://qa.cristspears.com', ''),
    emailImage = REPLACE(emailImage, 'http://qa.cristspears.com', ''),

    editable_1_image = REPLACE(editable_1_image, 'https://gatku.com', ''),
    editable_1_image = REPLACE(editable_1_image, 'http://gatku.com', ''),
    editable_1_image = REPLACE(editable_1_image, 'https://cristspears.com', ''),
    editable_1_image = REPLACE(editable_1_image, 'http://cristspears.com', ''),
    editable_1_image = REPLACE(editable_1_image, 'https://qa.cristspears.com', ''),
    editable_1_image = REPLACE(editable_1_image, 'http://qa.cristspears.com', ''),

    editable_2_image = REPLACE(editable_2_image, 'https://gatku.com', ''),
    editable_2_image = REPLACE(editable_2_image, 'http://gatku.com', ''),
    editable_2_image = REPLACE(editable_2_image, 'https://cristspears.com', ''),
    editable_2_image = REPLACE(editable_2_image, 'http://cristspears.com', ''),
    editable_2_image = REPLACE(editable_2_image, 'https://qa.cristspears.com', ''),
    editable_2_image = REPLACE(editable_2_image, 'http://qa.cristspears.com', ''),

    editable_3_image = REPLACE(editable_3_image, 'https://gatku.com', ''),
    editable_3_image = REPLACE(editable_3_image, 'http://gatku.com', ''),
    editable_3_image = REPLACE(editable_3_image, 'https://cristspears.com', ''),
    editable_3_image = REPLACE(editable_3_image, 'http://cristspears.com', ''),
    editable_3_image = REPLACE(editable_3_image, 'https://qa.cristspears.com', ''),
    editable_3_image = REPLACE(editable_3_image, 'http://qa.cristspears.com', ''),

    editable_4_image = REPLACE(editable_4_image, 'https://gatku.com', ''),
    editable_4_image = REPLACE(editable_4_image, 'http://gatku.com', ''),
    editable_4_image = REPLACE(editable_4_image, 'https://cristspears.com', ''),
    editable_4_image = REPLACE(editable_4_image, 'http://cristspears.com', ''),
    editable_4_image = REPLACE(editable_4_image, 'https://qa.cristspears.com', ''),
    editable_4_image = REPLACE(editable_4_image, 'http://qa.cristspears.com', '');

-- table: you_images:
UPDATE you_images
SET image = REPLACE(image, 'https://gatku.com', ''),
    image = REPLACE(image, 'http://gatku.com', ''),
    image = REPLACE(image, 'https://cristspears.com', ''),
    image = REPLACE(image, 'http://cristspears.com', ''),
    image = REPLACE(image, 'https://qa.cristspears.com', ''),
    image = REPLACE(image, 'http://qa.cristspears.com', '');