
-- Assign font size based on original values
UPDATE products target
INNER JOIN products source ON source.id = target.id
SET
  target.name_text_align_for_shelf = source.name_text_align,
  target.name_font_weight_for_shelf = source.name_font_weight,
  target.name_font_style_for_shelf = source.name_font_style,
  target.name_font_size_for_shelf = source.name_font_size,
  --
  target.name_text_align_for_mobile = source.name_text_align,
  target.name_font_weight_for_mobile = source.name_font_weight,
  target.name_font_style_for_mobile = source.name_font_style,
  --
  target.name_extension_font_weight_for_mobile = source.name_extension_font_weight,
  target.name_extension_font_style_for_mobile = source.name_extension_font_style,
  --
  target.name_extension_font_weight_for_shelf = source.name_extension_font_weight,
  target.name_extension_font_style_for_shelf = source.name_extension_font_style,
  --
  target.length_font_weight_for_mobile = source.length_font_weight,
  target.length_font_style_for_mobile = source.length_font_style,
  --
  target.length_font_weight_for_shelf = source.length_font_weight,
  target.length_font_style_for_shelf = source.length_font_style
WHERE target.id <> 5;

-- populate font styling based on row with id 5
UPDATE products target
INNER JOIN products source ON source.id = 5
SET
    target.name_font_size_for_mobile = source.name_font_size_for_mobile,
    target.name_extension_font_size = source.name_extension_font_size,
    target.length_font_size = source.length_font_size,
    target.name_extension_font_size_for_mobile = source.name_extension_font_size_for_mobile,
    target.name_extension_font_size_for_shelf = source.name_extension_font_size_for_shelf,
    target.length_font_size_for_mobile = source.length_font_size_for_mobile,
    target.length_font_size_for_shelf = source.length_font_size_for_shelf,
    target.name_font_size = source.name_font_size
WHERE target.id <> 5;
