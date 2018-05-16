/* Feature/29 Update images for package type products */


--supporting query


SELECT id, typeId, shortName
-- SELECT *
FROM products
WHERE shortName IN (
  'Dinner Getter',
  'Bahamas Basics',
  'Blue Water',
  'Lionfish'
) ;


-- updating queries

-- update queries by applying correct image urls, separate images

UPDATE `forge`.`products`
SET typeId = 8,
  attachedImage = 'https://gatku.com/img/uploads/251846217DinnerGetter_Website-Pole-Spear-Attached.jpg',
  detachedImage = 'https://gatku.com/img/uploads/738628581DinnerGetter_Website-Polespear-Detached.jpg',
  thumb = 'https://gatku.com/img/uploads/127180658DinnerGetter-Thumbnail-Polespear.jpg',
  emailImage = 'https://gatku.com/img/uploads/384671113dinnergetter-e.jpg'
WHERE id IN( 32, 33, 34, 35);

