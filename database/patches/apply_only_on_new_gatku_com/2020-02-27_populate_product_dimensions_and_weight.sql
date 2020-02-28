
-- Create temp table: forge.product_dimensions:

CREATE TEMPORARY TABLE forge.product_dimensions (
    id INT PRIMARY KEY,
    prod_length float,
    prod_width float,
    prod_height float,
    prod_weight float
);


-- Insert data to table: forge.product_dimensions:

INSERT INTO forge.product_dimensions
(id, prod_length, prod_width, prod_height, prod_weight)
VALUES
(1, 16.0000, 2.0000, 2.0000, 0.5000),
(2, 16.0000, 2.0000, 2.0000, 0.5000),
(3, 18.0000, 2.0000, 2.0000, 0.5000),
(4, 16.0000, 2.0000, 2.0000, 0.5000),
(5, 33.0000, 5.0000, 5.0000, 3.5000),
(6, 38.0000, 5.0000, 5.0000, 3.0000),
(7, 49.0000, 5.0000, 5.0000, 3.0000),
(8, 55.0000, 5.0000, 5.0000, 3.5000),
(9, 61.0000, 5.0000, 5.0000, 4.0000),
(10, 16.0000, 2.0000, 2.0000, 0.5000),
(11, 10.0000, 2.0000, 2.0000, 0.5000),
(12, 8.0000, 2.0000, 2.0000, 0.5000),
(21, 4.0000, 3.0000, 1.0000, 0.2000),
(22, 16.0000, 2.0000, 2.0000, 0.5000),
(23, 6.0000, 2.0000, 2.0000, 0.5000),
(24, 10.0000, 2.0000, 2.0000, 0.5000),
(25, 8.0000, 2.0000, 2.0000, 0.5000),
(26, 6.0000, 4.0000, 1.0000, 0.5000),
(28, 6.0000, 4.0000, 1.0000, 0.5000),
(29, 49.0000, 5.0000, 5.0000, 3.0000),
(30, 6.0000, 2.0000, 1.0000, 0.2000),
(31, 6.0000, 4.0000, 1.0000, 0.2000),
(39, 6.0000, 4.0000, 1.0000, 0.2000),
(40, 33.0000, 5.0000, 5.0000, 2.5000),
(41, 31.0000, 5.0000, 5.0000, 1.5000),
(43, 9.0000, 3.0000, 3.0000, 0.5000),
(44, 9.0000, 3.0000, 3.0000, 0.5000),
(45, 46.0000, 5.0000, 5.0000, 2.5000),
(46, 61.0000, 5.0000, 5.0000, 2.5000),
(47, 9.0000, 3.0000, 3.0000, 0.5000);



-- Update: prod_length

SET SQL_SAFE_UPDATES = 0;

UPDATE forge.products target,
    (SELECT * FROM forge.product_dimensions) source
SET target.prod_length = source.prod_length,
    target.prod_width = source.prod_width,
    target.prod_height = source.prod_height,
    target.prod_weight = source.prod_weight
WHERE target.id = source.id;

SET SQL_SAFE_UPDATES = 1;

-- Drop temp table: forge.product_dimensions

DROP TEMPORARY TABLE forge.product_dimensions;

