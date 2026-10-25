USE satellite_geo_repository;
SHOW TABLES;

SELECT 'MISSION' AS table_name, COUNT(*) AS row_count FROM MISSION
UNION ALL
SELECT 'SATELLITE', COUNT(*) FROM SATELLITE
UNION ALL
SELECT 'SATELLITE_MISSION', COUNT(*) FROM SATELLITE_MISSION
UNION ALL
SELECT 'SENSOR', COUNT(*) FROM SENSOR
UNION ALL
SELECT 'GROUND_STATION', COUNT(*) FROM GROUND_STATION
UNION ALL
SELECT 'GEO_LOCATION', COUNT(*) FROM GEO_LOCATION
UNION ALL
SELECT 'OBSERVATION', COUNT(*) FROM OBSERVATION
UNION ALL
SELECT 'DATA_PRODUCT', COUNT(*) FROM DATA_PRODUCT
UNION ALL
SELECT 'PROCESSING_ACTIVITY', COUNT(*) FROM PROCESSING_ACTIVITY;

USE satellite_geo_repository;

START TRANSACTION;

-- =====================================================
-- 1. MISSION
-- =====================================================

INSERT INTO MISSION
(mission_id, mission_name, agency, country, launch_date,
 start_date, end_date, status, description)
VALUES
(1, 'Copernicus Sentinel-2', 'European Space Agency',
 'European Union', '2015-06-23', '2015-06-23', NULL,
 'Active', 'Multispectral Earth observation mission.'),

(2, 'Landsat Program', 'NASA and USGS',
 'United States', '1972-07-23', '1972-07-23', NULL,
 'Active', 'Long-running land observation program.'),

(3, 'Copernicus Sentinel-1', 'European Space Agency',
 'European Union', '2014-04-03', '2014-04-03', NULL,
 'Active', 'Radar Earth observation mission.');

-- =====================================================
-- 2. SATELLITE
-- =====================================================

INSERT INTO SATELLITE
(satellite_id, satellite_name, launch_date, orbit_type,
 orbit_altitude_km, status)
VALUES
(1, 'Sentinel-2A', '2015-06-23', 'Sun-synchronous', 786.00, 'Active'),
(2, 'Sentinel-2B', '2017-03-07', 'Sun-synchronous', 786.00, 'Active'),
(3, 'Landsat 9', '2021-09-27', 'Sun-synchronous', 705.00, 'Active'),
(4, 'Sentinel-1A', '2014-04-03', 'Sun-synchronous', 693.00, 'Active');

-- =====================================================
-- 3. SATELLITE_MISSION
-- =====================================================

INSERT INTO SATELLITE_MISSION
(mission_id, satellite_id, assignment_start, assignment_end, role)
VALUES
(1, 1, '2015-06-23', NULL, 'Optical observation'),
(1, 2, '2017-03-07', NULL, 'Optical observation'),
(2, 3, '2021-09-27', NULL, 'Land monitoring'),
(3, 4, '2014-04-03', NULL, 'Radar observation');

-- =====================================================
-- 4. SENSOR
-- =====================================================

INSERT INTO SENSOR
(sensor_id, satellite_id, sensor_name, sensor_type,
 spatial_res, spectral_range, status)
VALUES
(1, 1, 'MSI', 'Multispectral', 10.00,
 'Visible, near-infrared and shortwave infrared', 'Active'),

(2, 2, 'MSI', 'Multispectral', 10.00,
 'Visible, near-infrared and shortwave infrared', 'Active'),

(3, 3, 'OLI-2', 'Optical', 30.00,
 'Visible, near-infrared and shortwave infrared', 'Active'),

(4, 3, 'TIRS-2', 'Thermal infrared', 100.00,
 'Thermal infrared', 'Active'),

(5, 4, 'C-SAR', 'Synthetic aperture radar', 10.00,
 'C-band microwave', 'Active');

-- =====================================================
-- 5. GROUND_STATION
-- Fictional sample records; not verified receiving sites.
-- =====================================================

INSERT INTO GROUND_STATION
(ground_station_id, station_name, operator, country,
 latitude, longitude, altitude, status)
VALUES
(1, 'Nordic EO Sample Station', 'Sample EO Network',
 'Norway', 60.3913, 5.3221, 120.00, 'Active'),

(2, 'Central Europe Sample Station', 'Sample EO Network',
 'Germany', 48.8566, 9.1829, 250.00, 'Active'),

(3, 'Iberian EO Sample Station', 'Sample EO Network',
 'Spain', 40.4168, -3.7038, 650.00, 'Active');

-- =====================================================
-- 6. GEO_LOCATION
-- =====================================================

INSERT INTO GEO_LOCATION
(geo_location_id, area_name, country, region,
 min_latitude, max_latitude, min_longitude, max_longitude)
VALUES
(1, 'Bengaluru', 'India', 'Karnataka',
 12.80, 13.20, 77.40, 77.80),

(2, 'Berlin', 'Germany', 'Berlin',
 52.30, 52.70, 13.20, 13.70),

(3, 'Madrid', 'Spain', 'Community of Madrid',
 40.20, 40.60, -3.90, -3.50),

(4, 'Oslo', 'Norway', 'Oslo',
 59.70, 60.00, 10.40, 10.90),

(5, 'Rome', 'Italy', 'Lazio',
 41.70, 42.00, 12.30, 12.80);

-- =====================================================
-- 7. OBSERVATION
-- Sample observation records for database testing.
-- These are not verified acquisition records from your ZIPs.
-- =====================================================

INSERT INTO OBSERVATION
(observation_id, sensor_id, ground_station_id, geo_location_id,
 observation_start, observation_end, orbit_number,
 cloud_cover_percent, observation_status)
VALUES
(1, 1, 1, 2, '2026-10-19 10:19:51',
 '2026-10-19 10:20:21', 45210, 12.50, 'Completed'),

(2, 1, 2, 3, '2026-10-19 10:19:51',
 '2026-10-19 10:20:21', 45210, 8.20, 'Completed'),

(3, 2, 2, 4, '2026-10-18 10:15:00',
 '2026-10-18 10:15:30', 45195, 24.00, 'Completed'),

(4, 3, 2, 2, '2026-10-17 10:05:00',
 '2026-10-17 10:05:30', 18250, 5.00, 'Completed'),

(5, 1, 3, 5, '2026-10-16 10:12:00',
 '2026-10-16 10:12:30', 45165, 45.00, 'Completed'),

(6, 5, 1, 1, '2026-10-15 06:30:00',
 '2026-10-15 06:30:20', 32100, 0.00, 'Completed'),

(7, 2, 3, 3, '2026-10-14 10:19:00',
 '2026-10-14 10:19:30', 45135, 18.00, 'Completed'),

(8, 1, 1, 4, '2026-10-13 10:10:00',
 '2026-10-13 10:10:30', 45120, 9.50, 'Completed'),

(9, 3, 2, 1, '2026-10-12 10:00:00',
 '2026-10-12 10:00:30', 18175, 30.00, 'Completed'),

(10, 1, 3, 2, '2026-10-11 10:19:00',
 '2026-10-11 10:19:30', 45090, 15.00, 'Completed');

-- =====================================================
-- 8. DATA_PRODUCT
-- =====================================================

INSERT INTO DATA_PRODUCT
(product_id, observation_id, geo_location_id, product_name,
 product_type, processing_level, version, creation_date)
VALUES
(1, 1, 2, 'S2A_BERLIN_L1C', 'Satellite Image', 'Level-1C',
 '1.0', '2026-10-19 14:00:00'),

(2, 2, 3, 'S2A_MADRID_L1C', 'Satellite Image', 'Level-1C',
 '1.0', '2026-10-19 14:10:00'),

(3, 3, 4, 'S2B_OSLO_L1C', 'Satellite Image', 'Level-1C',
 '1.0', '2026-10-18 14:00:00'),

(4, 4, 2, 'LANDSAT_BERLIN_L1', 'Satellite Image', 'Level-1',
 '1.0', '2026-10-17 13:00:00'),

(5, 5, 5, 'S2A_ROME_L1C', 'Satellite Image', 'Level-1C',
 '1.0', '2026-10-16 14:00:00'),

(6, 6, 1, 'S1_BENGALURU_GRD', 'Radar Image', 'GRD',
 '1.0', '2026-10-15 12:00:00'),

(7, 7, 3, 'LANDSAT_MADRID_L1', 'Satellite Image', 'Level-1',
 '1.0', '2026-10-14 13:00:00'),

(8, 8, 4, 'S2A_OSLO_L1C', 'Satellite Image', 'Level-1C',
 '1.0', '2026-10-13 14:00:00'),

(9, 9, 1, 'LANDSAT_BENGALURU_L1', 'Satellite Image', 'Level-1',
 '1.0', '2026-10-12 13:00:00'),

(10, 10, 2, 'S2A_BERLIN_L1C_V2', 'Satellite Image', 'Level-1C',
 '2.0', '2026-10-11 14:00:00');

-- =====================================================
-- 9. PROCESSING_ACTIVITY
-- Simulated processing history for database demonstration.
-- =====================================================

INSERT INTO PROCESSING_ACTIVITY
(activity_id, input_product_id, output_product_id,
 processing_type, software_name, parameters,
 started_at, completed_at, status)
VALUES
(1, 1, 2, 'Cloud Mask Generation', 'SNAP',
 'Simulated cloud threshold: 60 percent',
 '2026-10-20 09:00:00', '2026-10-20 09:10:00', 'Completed'),

(2, 2, 3, 'Image Quality Assessment', 'Python',
 'Simulated quality assessment of sample product metadata',
 '2026-10-20 09:15:00', '2026-10-20 09:25:00', 'Completed'),

(3, 4, 7, 'Image Comparison', 'Python',
 'Simulated comparison of sample land observation products',
 '2026-10-20 10:00:00', '2026-10-20 10:20:00', 'Completed'),

(4, 5, 8, 'Metadata Validation', 'SNAP',
 'Simulated validation of product metadata',
 '2026-10-20 10:30:00', '2026-10-20 10:40:00', 'Completed'),

(5, 6, 9, 'Data Quality Check', 'Python',
 'Simulated data quality checks',
 '2026-10-20 11:00:00', '2026-10-20 11:15:00', 'Completed');

COMMIT;

-- =====================================================
-- VERIFY ALL NINE TABLES
-- =====================================================

SELECT 'MISSION' AS table_name, COUNT(*) AS row_count FROM MISSION
UNION ALL
SELECT 'SATELLITE', COUNT(*) FROM SATELLITE
UNION ALL
SELECT 'SATELLITE_MISSION', COUNT(*) FROM SATELLITE_MISSION
UNION ALL
SELECT 'SENSOR', COUNT(*) FROM SENSOR
UNION ALL
SELECT 'GROUND_STATION', COUNT(*) FROM GROUND_STATION
UNION ALL
SELECT 'GEO_LOCATION', COUNT(*) FROM GEO_LOCATION
UNION ALL
SELECT 'OBSERVATION', COUNT(*) FROM OBSERVATION
UNION ALL
SELECT 'DATA_PRODUCT', COUNT(*) FROM DATA_PRODUCT
UNION ALL
SELECT 'PROCESSING_ACTIVITY', COUNT(*) FROM PROCESSING_ACTIVITY;

USE satellite_geo_repository;

INSERT INTO GEO_LOCATION
(geo_location_id, area_name, country, region,
 min_latitude, max_latitude, min_longitude, max_longitude)
VALUES
(1, 'Bengaluru', 'India', 'Karnataka',
 12.80, 13.20, 77.40, 77.80),
(2, 'Berlin', 'Germany', 'Berlin',
 52.30, 52.70, 13.20, 13.70),
(3, 'Madrid', 'Spain', 'Community of Madrid',
 40.20, 40.60, -3.90, -3.50),
(4, 'Oslo', 'Norway', 'Oslo',
 59.70, 60.00, 10.40, 10.90),
(5, 'Rome', 'Italy', 'Lazio',
 41.70, 42.00, 12.30, 12.80);
 
 SELECT * FROM GEO_LOCATION;
 
 INSERT INTO OBSERVATION
(observation_id, sensor_id, ground_station_id, geo_location_id,
 observation_start, observation_end, orbit_number,
 cloud_cover_percent, observation_status)
VALUES
(1, 1, 1, 2, '2026-10-19 10:19:51', '2026-10-19 10:20:21', 45210, 12.50, 'Completed'),
(2, 1, 2, 3, '2026-10-19 10:19:51', '2026-10-19 10:20:21', 45210, 8.20, 'Completed'),
(3, 2, 2, 4, '2026-10-18 10:15:00', '2026-10-18 10:15:30', 45195, 24.00, 'Completed'),
(4, 3, 2, 2, '2026-10-17 10:05:00', '2026-10-17 10:05:30', 18250, 5.00, 'Completed'),
(5, 1, 3, 5, '2026-10-16 10:12:00', '2026-10-16 10:12:30', 45165, 45.00, 'Completed'),
(6, 5, 1, 1, '2026-10-15 06:30:00', '2026-10-15 06:30:20', 32100, 0.00, 'Completed'),
(7, 2, 3, 3, '2026-10-14 10:19:00', '2026-10-14 10:19:30', 45135, 18.00, 'Completed'),
(8, 1, 1, 4, '2026-10-13 10:10:00', '2026-10-13 10:10:30', 45120, 9.50, 'Completed'),
(9, 3, 2, 1, '2026-10-12 10:00:00', '2026-10-12 10:00:30', 18175, 30.00, 'Completed'),
(10, 1, 3, 2, '2026-10-11 10:19:00', '2026-10-11 10:19:30', 45090, 15.00, 'Completed');

SELECT COUNT(*) AS total_locations FROM GEO_LOCATION;
SELECT COUNT(*) AS total_observations FROM OBSERVATION;

USE satellite_geo_repository;

INSERT INTO DATA_PRODUCT
(product_id, observation_id, geo_location_id, product_name,
 product_type, processing_level, version, creation_date)
VALUES
(1, 1, 2, 'S2A_BERLIN_L1C', 'Satellite Image', 'Level-1C',
 '1.0', '2026-10-19 14:00:00'),

(2, 2, 3, 'S2A_MADRID_L1C', 'Satellite Image', 'Level-1C',
 '1.0', '2026-10-19 14:10:00'),

(3, 3, 4, 'S2B_OSLO_L1C', 'Satellite Image', 'Level-1C',
 '1.0', '2026-10-18 14:00:00'),

(4, 4, 2, 'LANDSAT_BERLIN_L1', 'Satellite Image', 'Level-1',
 '1.0', '2026-10-17 13:00:00'),

(5, 5, 5, 'S2A_ROME_L1C', 'Satellite Image', 'Level-1C',
 '1.0', '2026-10-16 14:00:00'),

(6, 6, 1, 'S1_BENGALURU_GRD', 'Radar Image', 'GRD',
 '1.0', '2026-10-15 12:00:00'),

(7, 7, 3, 'LANDSAT_MADRID_L1', 'Satellite Image', 'Level-1',
 '1.0', '2026-10-14 13:00:00'),

(8, 8, 4, 'S2A_OSLO_L1C', 'Satellite Image', 'Level-1C',
 '1.0', '2026-10-13 14:00:00'),

(9, 9, 1, 'LANDSAT_BENGALURU_L1', 'Satellite Image', 'Level-1',
 '1.0', '2026-10-12 13:00:00'),

(10, 10, 2, 'S2A_BERLIN_L1C_V2', 'Satellite Image', 'Level-1C',
 '2.0', '2026-10-11 14:00:00');
 
 INSERT INTO PROCESSING_ACTIVITY
(activity_id, input_product_id, output_product_id,
 processing_type, software_name, parameters,
 started_at, completed_at, status)
VALUES
(1, 1, 2, 'Cloud Mask Generation', 'SNAP',
 'Simulated cloud threshold: 60 percent',
 '2026-10-20 09:00:00', '2026-10-20 09:10:00', 'Completed'),

(2, 2, 3, 'Image Quality Assessment', 'Python',
 'Simulated assessment of sample product metadata',
 '2026-10-20 09:15:00', '2026-10-20 09:25:00', 'Completed'),

(3, 4, 7, 'Image Comparison', 'Python',
 'Simulated comparison of sample image products',
 '2026-10-20 10:00:00', '2026-10-20 10:20:00', 'Completed'),

(4, 5, 8, 'Metadata Validation', 'SNAP',
 'Simulated product metadata validation',
 '2026-10-20 10:30:00', '2026-10-20 10:40:00', 'Completed'),

(5, 6, 9, 'Data Quality Check', 'Python',
 'Simulated data quality checks',
 '2026-10-20 11:00:00', '2026-10-20 11:15:00', 'Completed');