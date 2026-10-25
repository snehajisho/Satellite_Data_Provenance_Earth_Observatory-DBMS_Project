USE satellite_geo_repository;

DELIMITER $$

-- Procedure 1: Get all observations for a given satellite
CREATE PROCEDURE GetObservationsBySatellite(IN p_satellite_id INT)
BEGIN
    SELECT
        o.observation_id,
        s.satellite_name,
        se.sensor_name,
        g.area_name,
        o.observation_start,
        o.observation_end,
        o.cloud_cover_percent,
        o.observation_status
    FROM OBSERVATION o
    JOIN SENSOR se ON o.sensor_id = se.sensor_id
    JOIN SATELLITE s ON se.satellite_id = s.satellite_id
    JOIN GEO_LOCATION g ON o.geo_location_id = g.geo_location_id
    WHERE s.satellite_id = p_satellite_id
    ORDER BY o.observation_start;
END$$


-- Procedure 2: Get data products for a given geographic location
CREATE PROCEDURE GetProductsByLocation(IN p_geo_location_id INT)
BEGIN
    SELECT
        dp.product_id,
        dp.product_name,
        dp.product_type,
        dp.processing_level,
        dp.version,
        dp.creation_date,
        g.area_name
    FROM DATA_PRODUCT dp
    JOIN GEO_LOCATION g ON dp.geo_location_id = g.geo_location_id
    WHERE g.geo_location_id = p_geo_location_id
    ORDER BY dp.creation_date DESC;
END$$


-- Function 1: Count observations for a given satellite
CREATE FUNCTION CountObservationsBySatellite(p_satellite_id INT)
RETURNS INT
READS SQL DATA
BEGIN
    DECLARE observation_count INT;

    SELECT COUNT(*)
    INTO observation_count
    FROM OBSERVATION o
    JOIN SENSOR se ON o.sensor_id = se.sensor_id
    WHERE se.satellite_id = p_satellite_id;

    RETURN observation_count;
END$$

DELIMITER ;

USE satellite_geo_repository;

-- Test Procedure 1: Observations for satellite ID 1
CALL GetObservationsBySatellite(1);

-- Test Procedure 2: Products for geographic location ID 1
CALL GetProductsByLocation(1);

-- Test Function 1: Count observations for satellite ID 1
SELECT CountObservationsBySatellite(1) AS total_observations;