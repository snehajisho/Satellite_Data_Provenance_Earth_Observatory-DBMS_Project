
USE satellite_geo_repository;

-- =====================================================
-- QUERY 1: INNER JOIN
-- List observations with their satellite, sensor and location.
-- =====================================================

SELECT
    o.observation_id,
    s.satellite_name,
    se.sensor_name,
    g.area_name,
    o.observation_start,
    o.cloud_cover_percent
FROM OBSERVATION o
INNER JOIN SENSOR se
    ON o.sensor_id = se.sensor_id
INNER JOIN SATELLITE s
    ON se.satellite_id = s.satellite_id
INNER JOIN GEO_LOCATION g
    ON o.geo_location_id = g.geo_location_id
ORDER BY o.observation_id;


-- =====================================================
-- QUERY 2: LEFT JOIN
-- List all satellites, including those without observations.
-- =====================================================

SELECT
    s.satellite_id,
    s.satellite_name,
    se.sensor_name,
    se.sensor_type
FROM SATELLITE s
LEFT JOIN SENSOR se
    ON s.satellite_id = se.satellite_id
ORDER BY s.satellite_name;


-- =====================================================
-- QUERY 3: JOIN THREE TABLES
-- Show which satellites belong to which missions.
-- =====================================================

SELECT
    m.mission_name,
    s.satellite_name,
    sm.role,
    sm.assignment_start,
    sm.assignment_end
FROM MISSION m
INNER JOIN SATELLITE_MISSION sm
    ON m.mission_id = sm.mission_id
INNER JOIN SATELLITE s
    ON sm.satellite_id = s.satellite_id
ORDER BY m.mission_name, s.satellite_name;


-- =====================================================
-- QUERY 4: DATA PRODUCT DETAILS
-- Show products and their associated observations.
-- =====================================================

SELECT
    dp.product_id,
    dp.product_name,
    dp.product_type,
    dp.processing_level,
    o.observation_id,
    g.area_name
FROM DATA_PRODUCT dp
INNER JOIN OBSERVATION o
    ON dp.observation_id = o.observation_id
INNER JOIN GEO_LOCATION g
    ON o.geo_location_id = g.geo_location_id
ORDER BY dp.product_id;


-- =====================================================
-- QUERY 5: PROCESSING PROVENANCE
-- Trace each processing activity from input to output.
-- =====================================================

SELECT
    pa.activity_id,
    ip.product_name AS input_product,
    op.product_name AS output_product,
    pa.processing_type,
    pa.software_name,
    pa.status
FROM PROCESSING_ACTIVITY pa
INNER JOIN DATA_PRODUCT ip
    ON pa.input_product_id = ip.product_id
INNER JOIN DATA_PRODUCT op
    ON pa.output_product_id = op.product_id
ORDER BY pa.activity_id;

-- Q6: Count observations by status
SELECT observation_status, COUNT(*) AS total_observations
FROM OBSERVATION
GROUP BY observation_status
ORDER BY total_observations DESC;

-- Q7: Average cloud cover by geographic area
SELECT g.area_name, AVG(o.cloud_cover_percent) AS average_cloud_cover
FROM OBSERVATION o
INNER JOIN GEO_LOCATION g
    ON o.geo_location_id = g.geo_location_id
GROUP BY g.geo_location_id, g.area_name
ORDER BY average_cloud_cover DESC;

-- Q8: Count data products by processing level
SELECT processing_level, COUNT(*) AS total_products
FROM DATA_PRODUCT
GROUP BY processing_level
ORDER BY total_products DESC;

-- Q9: Geographic areas with more than one observation
SELECT g.area_name, COUNT(o.observation_id) AS total_observations
FROM GEO_LOCATION g
INNER JOIN OBSERVATION o
    ON g.geo_location_id = o.geo_location_id
GROUP BY g.geo_location_id, g.area_name
HAVING COUNT(o.observation_id) > 1
ORDER BY total_observations DESC;

-- Q10: Processing types with at least two activities
SELECT processing_type, COUNT(*) AS total_activities
FROM PROCESSING_ACTIVITY
GROUP BY processing_type
HAVING COUNT(*) >= 2
ORDER BY total_activities DESC;

-- Q11: Observations with cloud cover above the overall average
SELECT observation_id, cloud_cover_percent, observation_status
FROM OBSERVATION
WHERE cloud_cover_percent > (
    SELECT AVG(cloud_cover_percent)
    FROM OBSERVATION
)
ORDER BY cloud_cover_percent DESC;

-- Q12: Satellites that have at least one sensor
SELECT satellite_id, satellite_name
FROM SATELLITE
WHERE satellite_id IN (
    SELECT satellite_id
    FROM SENSOR
)
ORDER BY satellite_name;

-- Q13: Data products created from observations in Berlin
SELECT product_id, product_name, processing_level
FROM DATA_PRODUCT
WHERE observation_id IN (
    SELECT o.observation_id
    FROM OBSERVATION o
    INNER JOIN GEO_LOCATION g
        ON o.geo_location_id = g.geo_location_id
    WHERE g.area_name = 'Berlin'
)
ORDER BY product_id;

USE satellite_geo_repository;

-- Q6: Count observations for each satellite
SELECT s.satellite_name, COUNT(o.observation_id) AS total_observations
FROM SATELLITE s
JOIN SENSOR se ON s.satellite_id = se.satellite_id
JOIN OBSERVATION o ON se.sensor_id = o.sensor_id
GROUP BY s.satellite_id, s.satellite_name
ORDER BY total_observations DESC;


-- Q7: Average cloud cover for each geographic location
SELECT g.area_name, AVG(o.cloud_cover_percent) AS average_cloud_cover
FROM GEO_LOCATION g
JOIN OBSERVATION o ON g.geo_location_id = o.geo_location_id
GROUP BY g.geo_location_id, g.area_name
ORDER BY average_cloud_cover DESC;


-- Q8: Locations with at least two observations
SELECT g.area_name, COUNT(o.observation_id) AS observation_count
FROM GEO_LOCATION g
JOIN OBSERVATION o ON g.geo_location_id = o.geo_location_id
GROUP BY g.geo_location_id, g.area_name
HAVING COUNT(o.observation_id) >= 2;


-- Q9: Find data products with processing levels above the average
SELECT product_id, product_name, processing_level
FROM DATA_PRODUCT
WHERE processing_level > (
    SELECT AVG(processing_level)
    FROM DATA_PRODUCT
);


-- Q10: Find satellites that have at least one observation
SELECT satellite_id, satellite_name
FROM SATELLITE
WHERE satellite_id IN (
    SELECT DISTINCT se.satellite_id
    FROM SENSOR se
    JOIN OBSERVATION o ON se.sensor_id = o.sensor_id
);


-- Q11: Find products that have been used as inputs in processing
SELECT product_id, product_name
FROM DATA_PRODUCT
WHERE product_id IN (
    SELECT DISTINCT input_product_id
    FROM PROCESSING_ACTIVITY
);


-- Q12: Count products by processing level
SELECT processing_level, COUNT(*) AS total_products
FROM DATA_PRODUCT
GROUP BY processing_level
ORDER BY total_products DESC;