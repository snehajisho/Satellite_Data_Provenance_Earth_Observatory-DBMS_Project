USE satellite_geo_repository;

-- View 1: Observation details with satellite, sensor, and location
CREATE OR REPLACE VIEW vw_observation_details AS
SELECT
    o.observation_id,
    s.satellite_name,
    se.sensor_name,
    se.sensor_type,
    g.area_name,
    g.country,
    o.observation_start,
    o.observation_end,
    o.cloud_cover_percent,
    o.observation_status
FROM OBSERVATION o
JOIN SENSOR se ON o.sensor_id = se.sensor_id
JOIN SATELLITE s ON se.satellite_id = s.satellite_id
JOIN GEO_LOCATION g ON o.geo_location_id = g.geo_location_id;

-- View 2: Data products with their observation and location details
CREATE OR REPLACE VIEW vw_data_product_details AS
SELECT
    dp.product_id,
    dp.product_name,
    dp.product_type,
    dp.processing_level,
    dp.version,
    dp.creation_date,
    o.observation_id,
    g.area_name,
    g.country
FROM DATA_PRODUCT dp
JOIN OBSERVATION o ON dp.observation_id = o.observation_id
JOIN GEO_LOCATION g ON dp.geo_location_id = g.geo_location_id;

-- View 3: Processing provenance showing input and output products
CREATE OR REPLACE VIEW vw_processing_provenance AS
SELECT
    pa.activity_id,
    ip.product_name AS input_product,
    op.product_name AS output_product,
    pa.processing_type,
    pa.software_name,
    pa.parameters,
    pa.started_at,
    pa.completed_at,
    pa.status
FROM PROCESSING_ACTIVITY pa
JOIN DATA_PRODUCT ip ON pa.input_product_id = ip.product_id
JOIN DATA_PRODUCT op ON pa.output_product_id = op.product_id;

USE satellite_geo_repository;

SELECT * FROM vw_observation_details;
SELECT * FROM vw_data_product_details;
SELECT * FROM vw_processing_provenance;