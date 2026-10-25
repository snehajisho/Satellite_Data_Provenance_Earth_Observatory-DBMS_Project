
USE satellite_geo_repository;

-- Trigger 1: Validate cloud cover before inserting an observation
DELIMITER $$

CREATE TRIGGER trg_validate_cloud_cover_insert
BEFORE INSERT ON OBSERVATION
FOR EACH ROW
BEGIN
    IF NEW.cloud_cover_percent < 0 OR NEW.cloud_cover_percent > 100 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cloud cover must be between 0 and 100 percent';
    END IF;
END$$

-- Trigger 2: Validate cloud cover before updating an observation
CREATE TRIGGER trg_validate_cloud_cover_update
BEFORE UPDATE ON OBSERVATION
FOR EACH ROW
BEGIN
    IF NEW.cloud_cover_percent < 0 OR NEW.cloud_cover_percent > 100 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cloud cover must be between 0 and 100 percent';
    END IF;
END$$

-- Trigger 3: Validate processing activity completion time
CREATE TRIGGER trg_validate_processing_activity
BEFORE INSERT ON PROCESSING_ACTIVITY
FOR EACH ROW
BEGIN
    IF NEW.completed_at IS NOT NULL
       AND NEW.started_at IS NOT NULL
       AND NEW.completed_at < NEW.started_at THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Completion time cannot precede start time';
    END IF;
END$$

DELIMITER ;

SHOW TRIGGERS FROM satellite_geo_repository;