
-- populate font styling based on row with id 5
UPDATE products target
INNER JOIN products source ON source.id = 5
SET
    target.name_font_style = source.name_font_style,
    target.name_font_weight = source.name_font_weight,
    target.name_extension_font_style = source.name_extension_font_style,
    target.name_extension_font_weight = source.name_extension_font_weight,
    target.length_font_style = source.length_font_style,
    target.length_font_weight = source.length_font_weight,
    target.name_font_size = source.name_font_size,
    target.name_extension_font_size = source.name_extension_font_size,
    target.length_font_size = source.length_font_size,
    target.mobile_name_font_style = source.mobile_name_font_style,
    target.mobile_name_font_weight = source.mobile_name_font_weight,
    target.mobile_name_font_size = source.mobile_name_font_size,
    target.name_text_align_for_mobile = source.name_text_align_for_mobile,
    target.name_font_weight_for_mobile = source.name_font_weight_for_mobile,
    target.name_font_style_for_mobile = source.name_font_style_for_mobile,
    target.name_font_size_for_mobile = source.name_font_size_for_mobile,
    target.name_text_align_for_shelf = source.name_text_align_for_shelf,
    target.name_font_weight_for_shelf = source.name_font_weight_for_shelf,
    target.name_font_style_for_shelf = source.name_font_style_for_shelf,
    target.name_font_size_for_shelf = source.name_font_size_for_shelf,
    target.name_extension_font_weight_for_mobile = source.name_extension_font_weight_for_mobile,
    target.name_extension_font_style_for_mobile = source.name_extension_font_style_for_mobile,
    target.name_extension_font_size_for_mobile = source.name_extension_font_size_for_mobile,
    target.name_extension_font_weight_for_shelf = source.name_extension_font_weight_for_shelf,
    target.name_extension_font_style_for_shelf = source.name_extension_font_style_for_shelf,
    target.name_extension_font_size_for_shelf = source.name_extension_font_size_for_shelf,
    target.length_font_weight_for_mobile = source.length_font_weight_for_mobile,
    target.length_font_style_for_mobile = source.length_font_style_for_mobile,
    target.length_font_size_for_mobile = source.length_font_size_for_mobile,
    target.length_font_weight_for_shelf = source.length_font_weight_for_shelf,
    target.length_font_style_for_shelf = source.length_font_style_for_shelf,
    target.length_font_size_for_shelf = source.length_font_size_for_shelf
WHERE target.id <> 5;