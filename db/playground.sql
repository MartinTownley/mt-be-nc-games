\c nc_games_test

--SELECT review_id FROM comments;
-- SELECT reviews.*, COUNT(comment_id) AS comment_count
-- FROM reviews
-- LEFT JOIN comments ON reviews.review_id = comments.review_id
-- GROUP BY reviews.review_id
-- ;

-- left join will add a comment_id to reviews
-- join comments to reviews where review.review_id = comments.review_id

-- left join
-- JOIN, GROUP, COUNT

-- select all columns + count

UPDATE reviews
SET 
    votes = 5
WHERE 
    review_id = 1
RETURNING *
;

