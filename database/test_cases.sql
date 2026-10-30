
USE satellite_geo_repository;

-- =====================================================
-- TEST CASE 1: Verify total geographic locations
-- Expected: 10
-- =====================================================

SELECT
    'TC29 - Geographic Locations' AS test_case,
    COUNT(*) AS actual_count,
    IF(COUNT(*) = 10, 'PASS', 'FAIL') AS result
FROM GEO_LOCATION;


-- =====================================================
-- TEST CASE 2: Verify total observations
-- Expected: 20
-- =====================================================

SELECT
    'TC28 - Observation Records' AS test_case,
    COUNT(*) AS actual_count,
    IF(COUNT(*) = 20, 'PASS', 'FAIL') AS result
FROM OBSERVATION;


-- =====================================================
-- TEST CASE 3: Verify total data products
-- Expected: 20
-- =====================================================

SELECT
    'TC30 - Data Products' AS test_case,
    COUNT(*) AS actual_count,
    IF(COUNT(*) = 20, 'PASS', 'FAIL') AS result
FROM DATA_PRODUCT;


-- =====================================================
-- TEST CASE 4: Verify processing activities
-- Expected: 10
-- =====================================================

SELECT
    'TC32 - Processing Activities' AS test_case,
    COUNT(*) AS actual_count,
    IF(COUNT(*) = 10, 'PASS', 'FAIL') AS result
FROM PROCESSING_ACTIVITY;


-- =====================================================
-- TEST CASE 5: Verify all 10 locations exist
-- =====================================================

SELECT
    'TC05-TC11 - Location Availability' AS test_case,
    COUNT(DISTINCT area_name) AS actual_count,
    IF(COUNT(DISTINCT area_name) = 10, 'PASS', 'FAIL') AS result
FROM GEO_LOCATION
WHERE area_name IN (
    'Bengaluru', 'Berlin', 'Madrid', 'Oslo', 'Rome',
    'Mumbai', 'Delhi', 'Chennai', 'Helsinki', 'Moscow'
);


-- =====================================================
-- TEST CASE 6: Check observations have valid locations
-- Expected: 0 invalid records
-- =====================================================

SELECT
    'TC21 - Observation Location Integrity' AS test_case,
    COUNT(*) AS invalid_records,
    IF(COUNT(*) = 0, 'PASS', 'FAIL') AS result
FROM OBSERVATION o
LEFT JOIN GEO_LOCATION g
    ON o.geo_location_id = g.geo_location_id
WHERE g.geo_location_id IS NULL;


-- =====================================================
-- TEST CASE 7: Check data products have valid observations
-- Expected: 0 invalid records
-- =====================================================

SELECT
    'TC23 - Product Observation Integrity' AS test_case,
    COUNT(*) AS invalid_records,
    IF(COUNT(*) = 0, 'PASS', 'FAIL') AS result
FROM DATA_PRODUCT p
LEFT JOIN OBSERVATION o
    ON p.observation_id = o.observation_id
WHERE o.observation_id IS NULL;


-- =====================================================
-- TEST CASE 8: Check product-location relationships
-- Expected: 0 mismatches
-- =====================================================

SELECT
    'TC24 - Product Location Integrity' AS test_case,
    COUNT(*) AS mismatches,
    IF(COUNT(*) = 0, 'PASS', 'FAIL') AS result
FROM DATA_PRODUCT p
JOIN OBSERVATION o
    ON p.observation_id = o.observation_id
WHERE p.geo_location_id <> o.geo_location_id;


-- =====================================================
-- TEST CASE 9: Check processing activity relationships
-- Expected: 0 invalid references
-- =====================================================

SELECT
    'TC25 - Processing Provenance Integrity' AS test_case,
    COUNT(*) AS invalid_records,
    IF(COUNT(*) = 0, 'PASS', 'FAIL') AS result
FROM PROCESSING_ACTIVITY a
LEFT JOIN DATA_PRODUCT i
    ON a.input_product_id = i.product_id
LEFT JOIN DATA_PRODUCT o
    ON a.output_product_id = o.product_id
WHERE i.product_id IS NULL
   OR o.product_id IS NULL;


-- =====================================================
-- TEST CASE 10: Check processing history for new products
-- Expected: 5 activities
-- =====================================================

SELECT
    'TC25 - New Product Processing History' AS test_case,
    COUNT(*) AS actual_count,
    IF(COUNT(*) = 5, 'PASS', 'FAIL') AS result
FROM PROCESSING_ACTIVITY
WHERE output_product_id IN (12, 14, 16, 18, 20);


-- =====================================================
-- TEST CASE 11: Display observation details with locations
-- =====================================================

SELECT
    o.observation_id,
    g.area_name,
    g.country,
    o.observation_start,
    o.cloud_cover_percent,
    o.observation_status
FROM OBSERVATION o
JOIN GEO_LOCATION g
    ON o.geo_location_id = g.geo_location_id
ORDER BY o.observation_id;


-- =====================================================
-- TEST CASE 12: Display products with processing history
-- =====================================================

SELECT
    p.product_id,
    p.product_name,
    a.activity_id,
    a.processing_type,
    a.software_name,
    a.status
FROM DATA_PRODUCT p
LEFT JOIN PROCESSING_ACTIVITY a
    ON p.product_id = a.input_product_id
    OR p.product_id = a.output_product_id
ORDER BY p.product_id, a.activity_id;


-- =====================================================
-- TEST CASE 13: Verify cloud cover values
-- Expected: No values outside 0-100
-- =====================================================

SELECT
    'TC19 - Cloud Cover Validation' AS test_case,
    COUNT(*) AS invalid_records,
    IF(COUNT(*) = 0, 'PASS', 'FAIL') AS result
FROM OBSERVATION
WHERE cloud_cover_percent < 0
   OR cloud_cover_percent > 100;
