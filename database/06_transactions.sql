
USE satellite_geo_repository;

-- Example 1: COMMIT a valid transaction
-- Update a data product's version and save the change.

START TRANSACTION;

UPDATE DATA_PRODUCT
SET version = version
WHERE product_id = 1;

COMMIT;

-- Verify the record
SELECT product_id, product_name, version
FROM DATA_PRODUCT
WHERE product_id = 1;


-- Example 2: ROLLBACK a transaction
-- Temporarily update a product, then undo the change.

START TRANSACTION;

UPDATE DATA_PRODUCT
SET version = 'ROLLBACK_TEST'
WHERE product_id = 1;

-- Check the temporary value before rollback
SELECT product_id, product_name, version
FROM DATA_PRODUCT
WHERE product_id = 1;

ROLLBACK;

-- Verify the original version is restored
SELECT product_id, product_name, version
FROM DATA_PRODUCT
WHERE product_id = 1;


-- Example 3: Transaction with multiple updates
-- Demonstrate that multiple changes can be committed together.

START TRANSACTION;

UPDATE DATA_PRODUCT
SET version = CONCAT(version, '')
WHERE product_id IN (1, 2);

COMMIT;

-- Verify the affected records
SELECT product_id, product_name, version
FROM DATA_PRODUCT
WHERE product_id IN (1, 2)
ORDER BY product_id;