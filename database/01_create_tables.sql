CREATE DATABASE satellite_geo_repository;

USE satellite_geo_repository;

CREATE TABLE MISSION (
    mission_id INT PRIMARY KEY,
    mission_name VARCHAR(100) NOT NULL,
    agency VARCHAR(100) NOT NULL,
    country VARCHAR(100),
    launch_date DATE,
    start_date DATE,
    end_date DATE,
    status VARCHAR(30),
    description TEXT,

    CHECK (
        end_date IS NULL
        OR start_date IS NULL
        OR end_date >= start_date
    ),

    CHECK (
        start_date IS NULL
        OR launch_date IS NULL
        OR start_date >= launch_date
    )
);


CREATE TABLE SATELLITE (
    satellite_id INT PRIMARY KEY,
    satellite_name VARCHAR(100) NOT NULL,
    launch_date DATE,
    orbit_type VARCHAR(50),
    orbit_altitude_km DECIMAL(8,2),
    status VARCHAR(30),

    UNIQUE (satellite_name),

    CHECK (
        orbit_altitude_km IS NULL
        OR orbit_altitude_km > 0
    )
);


CREATE TABLE SATELLITE_MISSION (
    mission_id INT NOT NULL,
    satellite_id INT NOT NULL,
    assignment_start DATE,
    assignment_end DATE,
    role VARCHAR(50),

    PRIMARY KEY (mission_id, satellite_id),

    FOREIGN KEY (mission_id)
        REFERENCES MISSION(mission_id),

    FOREIGN KEY (satellite_id)
        REFERENCES SATELLITE(satellite_id),

    CHECK (
        assignment_end IS NULL
        OR assignment_start IS NULL
        OR assignment_end >= assignment_start
    )
);



CREATE TABLE SENSOR (
    sensor_id INT PRIMARY KEY,
    satellite_id INT NOT NULL,
    sensor_name VARCHAR(100) NOT NULL,
    sensor_type VARCHAR(50),
    spatial_res DECIMAL(8,2),
    spectral_range VARCHAR(100),
    status VARCHAR(30),

    FOREIGN KEY (satellite_id)
        REFERENCES SATELLITE(satellite_id),

    UNIQUE (satellite_id, sensor_name),

    CHECK (
        spatial_res IS NULL
        OR spatial_res > 0
    )
);


CREATE TABLE GROUND_STATION (
    ground_station_id INT PRIMARY KEY,
    station_name VARCHAR(100) NOT NULL,
    operator VARCHAR(100),
    country VARCHAR(100),
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    altitude DECIMAL(8,2),
    status VARCHAR(30),

    UNIQUE (station_name),

    CHECK (
        latitude IS NULL
        OR latitude BETWEEN -90 AND 90
    ),

    CHECK (
        longitude IS NULL
        OR longitude BETWEEN -180 AND 180
    )
);



CREATE TABLE GEO_LOCATION (
    geo_location_id INT PRIMARY KEY,
    area_name VARCHAR(100) NOT NULL,
    country VARCHAR(100),
    region VARCHAR(100),
    min_latitude DECIMAL(9,6),
    max_latitude DECIMAL(9,6),
    min_longitude DECIMAL(9,6),
    max_longitude DECIMAL(9,6),

    UNIQUE (area_name),

    CHECK (
        min_latitude IS NULL
        OR min_latitude BETWEEN -90 AND 90
    ),

    CHECK (
        max_latitude IS NULL
        OR max_latitude BETWEEN -90 AND 90
    ),

    CHECK (
        min_longitude IS NULL
        OR min_longitude BETWEEN -180 AND 180
    ),

    CHECK (
        max_longitude IS NULL
        OR max_longitude BETWEEN -180 AND 180
    ),

    CHECK (
        min_latitude IS NULL
        OR max_latitude IS NULL
        OR min_latitude <= max_latitude
    ),

    CHECK (
        min_longitude IS NULL
        OR max_longitude IS NULL
        OR min_longitude <= max_longitude
    )
);

CREATE TABLE OBSERVATION (
    observation_id INT PRIMARY KEY,
    sensor_id INT NOT NULL,
    ground_station_id INT NOT NULL,
    geo_location_id INT NOT NULL,
    observation_start DATETIME,
    observation_end DATETIME,
    orbit_number INT,
    cloud_cover_percent DECIMAL(5,2),
    observation_status VARCHAR(30),

    FOREIGN KEY (sensor_id)
        REFERENCES SENSOR(sensor_id),

    FOREIGN KEY (ground_station_id)
        REFERENCES GROUND_STATION(ground_station_id),

    FOREIGN KEY (geo_location_id)
        REFERENCES GEO_LOCATION(geo_location_id),

    CHECK (
        observation_end IS NULL
        OR observation_start IS NULL
        OR observation_end >= observation_start
    ),

    CHECK (
        orbit_number IS NULL
        OR orbit_number > 0
    ),

    CHECK (
        cloud_cover_percent IS NULL
        OR cloud_cover_percent BETWEEN 0 AND 100
    )
);
CREATE TABLE DATA_PRODUCT (
    product_id INT PRIMARY KEY,
    observation_id INT NOT NULL,
    geo_location_id INT NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    product_type VARCHAR(50),
    processing_level VARCHAR(30),
    version VARCHAR(30),
    creation_date DATETIME,

    FOREIGN KEY (observation_id)
        REFERENCES OBSERVATION(observation_id),

    FOREIGN KEY (geo_location_id)
        REFERENCES GEO_LOCATION(geo_location_id),

    UNIQUE (product_name, version)
);
CREATE TABLE PROCESSING_ACTIVITY (
    activity_id INT PRIMARY KEY,
    input_product_id INT NOT NULL,
    output_product_id INT NOT NULL,
    processing_type VARCHAR(100),
    software_name VARCHAR(100),
    parameters TEXT,
    started_at DATETIME,
    completed_at DATETIME,
    status VARCHAR(30),

    FOREIGN KEY (input_product_id)
        REFERENCES DATA_PRODUCT(product_id),

    FOREIGN KEY (output_product_id)
        REFERENCES DATA_PRODUCT(product_id),

    CHECK (input_product_id <> output_product_id),

    CHECK (
        completed_at IS NULL
        OR started_at IS NULL
        OR completed_at >= started_at
    )
);

SHOW TABLES;

DESCRIBE MISSION;

DESCRIBE SATELLITE;

DESCRIBE SATELLITE_MISSION;

DESCRIBE SENSOR;

DESCRIBE GROUND_STATION;

DESCRIBE GEO_LOCATION;

DESCRIBE OBSERVATION;

DESCRIBE DATA_PRODUCT;

DESCRIBE PROCESSING_ACTIVITY;

DESCRIBE GEO_LOCATION;
