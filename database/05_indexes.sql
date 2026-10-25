
USE satellite_geo_repository;

-- Index 1: Find observations by sensor
CREATE INDEX idx_observation_sensor
ON OBSERVATION(sensor_id);

-- Index 2: Find observations by geographic location
CREATE INDEX idx_observation_location
ON OBSERVATION(geo_location_id);

-- Index 3: Find observations by observation start time
CREATE INDEX idx_observation_start
ON OBSERVATION(observation_start);

-- Index 4: Find data products by observation
CREATE INDEX idx_data_product_observation
ON DATA_PRODUCT(observation_id);

-- Index 5: Find processing activities by input product
CREATE INDEX idx_processing_input_product
ON PROCESSING_ACTIVITY(input_product_id);

-- Index 6: Find processing activities by output product
CREATE INDEX idx_processing_output_product
ON PROCESSING_ACTIVITY(output_product_id);


SHOW INDEX FROM OBSERVATION;
SHOW INDEX FROM DATA_PRODUCT;
SHOW INDEX FROM PROCESSING_ACTIVITY;