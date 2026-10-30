// ============================================================
// MongoDB - Satellite Earth Observation Metadata
// Database: satellite_geo_repository
// ============================================================

// Select the project database
const db = db.getSiblingDB("satellite_geo_repository");

// Start fresh when this script is re-run
db.observation_metadata.drop();

// ============================================================
// OBSERVATION METADATA
// One MongoDB document corresponds to one SQL OBSERVATION.
// The observation_id is the bridge between MySQL and MongoDB.
// ============================================================

db.observation_metadata.insertMany([

    // --------------------------------------------------------
    // Observation 1 - Sentinel-2A / Berlin
    // --------------------------------------------------------
    {
        observation_id: 1,
        data_product_id: 1,

        satellite: {
            satellite_id: 1,
            satellite_name: "Sentinel-2A",
            mission: "Copernicus Sentinel-2"
        },

        sensor: {
            sensor_id: 1,
            name: "MSI",
            type: "Multispectral"
        },

        location: {
            geo_location_id: 2,
            area_name: "Berlin",
            country: "Germany",
            region: "Berlin"
        },

        image_metadata: {
            image_type: "Multispectral Earth Observation",
            format: "JPEG2000",
            preview_format: "JPEG",
            thumbnail_path: "images/berlin-1.jpeg",
            image_paths: [
                "images/berlin-1.jpeg",
                "images/berlin-2.jpeg"
            ],
            available_visualizations: [
                "true_colour",
                "false_colour"
            ],
            source_product: "S2A_BERLIN_L1C"
        },

        spectral_metadata: {
            bands: [
                "B01", "B02", "B03", "B04",
                "B05", "B06", "B07", "B08",
                "B8A", "B09", "B10", "B11", "B12"
            ],
            band_groups: {
                visible: ["B02", "B03", "B04"],
                near_infrared: ["B08", "B8A"],
                shortwave_infrared: ["B11", "B12"]
            },
            spatial_resolution_m: [10, 20, 60]
        },

        quality_metadata: {
            quality_flag: "GOOD",
            cloud_assessment: "Low",
            cloud_cover_percent: 12.5,
            geometric_quality: "GOOD",
            radiometric_quality: "GOOD"
        },

        processing_metadata: {
            atmospheric_correction: "Not applied",
            cloud_masking: "Available",
            terrain_correction: "Not applied",
            processing_notes: [
                "Level-1C product",
                "Suitable for visual inspection"
            ]
        }
    },

    // --------------------------------------------------------
    // Observation 2 - Sentinel-2A / Madrid
    // --------------------------------------------------------
    {
        observation_id: 2,
        data_product_id: 2,

        satellite: {
            satellite_id: 1,
            satellite_name: "Sentinel-2A",
            mission: "Copernicus Sentinel-2"
        },

        sensor: {
            sensor_id: 1,
            name: "MSI",
            type: "Multispectral"
        },

        location: {
            geo_location_id: 3,
            area_name: "Madrid",
            country: "Spain",
            region: "Community of Madrid"
        },

        image_metadata: {
            image_type: "Multispectral Earth Observation",
            format: "JPEG2000",
            preview_format: "JPEG",
            thumbnail_path: "images/madrid-1.jpeg",
            image_paths: [
                "images/madrid-1.jpeg",
                "images/madrid-2.jpeg"
            ],
            available_visualizations: [
                "true_colour",
                "false_colour"
            ],
            source_product: "S2A_MADRID_L1C"
        },

        spectral_metadata: {
            bands: [
                "B01", "B02", "B03", "B04",
                "B05", "B06", "B07", "B08",
                "B8A", "B09", "B10", "B11", "B12"
            ],
            band_groups: {
                visible: ["B02", "B03", "B04"],
                near_infrared: ["B08", "B8A"],
                shortwave_infrared: ["B11", "B12"]
            },
            spatial_resolution_m: [10, 20, 60]
        },

        quality_metadata: {
            quality_flag: "GOOD",
            cloud_assessment: "Very Low",
            cloud_cover_percent: 8.2,
            geometric_quality: "GOOD",
            radiometric_quality: "GOOD"
        },

        processing_metadata: {
            atmospheric_correction: "Not applied",
            cloud_masking: "Available",
            terrain_correction: "Not applied",
            processing_notes: [
                "Level-1C product",
                "Low cloud contamination"
            ]
        }
    },

    // --------------------------------------------------------
    // Observation 3 - Sentinel-2B / Oslo
    // --------------------------------------------------------
    {
        observation_id: 3,
        data_product_id: 3,

        satellite: {
            satellite_id: 2,
            satellite_name: "Sentinel-2B",
            mission: "Copernicus Sentinel-2"
        },

        sensor: {
            sensor_id: 2,
            name: "MSI",
            type: "Multispectral"
        },

        location: {
            geo_location_id: 4,
            area_name: "Oslo",
            country: "Norway",
            region: "Oslo"
        },

        image_metadata: {
            image_type: "Multispectral Earth Observation",
            format: "JPEG2000",
            preview_format: "JPEG",
            thumbnail_path: "images/oslo-1.jpeg",
            image_paths: [
                "images/oslo-1.jpeg",
                "images/oslo-2.jpeg"
            ],
            available_visualizations: [
                "true_colour",
                "false_colour"
            ],
            source_product: "S2B_OSLO_L1C"
        },

        spectral_metadata: {
            bands: [
                "B01", "B02", "B03", "B04",
                "B05", "B06", "B07", "B08",
                "B8A", "B09", "B10", "B11", "B12"
            ],
            band_groups: {
                visible: ["B02", "B03", "B04"],
                near_infrared: ["B08", "B8A"],
                shortwave_infrared: ["B11", "B12"]
            },
            spatial_resolution_m: [10, 20, 60]
        },

        quality_metadata: {
            quality_flag: "ACCEPTABLE",
            cloud_assessment: "Moderate",
            cloud_cover_percent: 24.0,
            geometric_quality: "GOOD",
            radiometric_quality: "GOOD"
        },

        processing_metadata: {
            atmospheric_correction: "Not applied",
            cloud_masking: "Available",
            terrain_correction: "Not applied",
            processing_notes: [
                "Level-1C product",
                "Moderate cloud coverage"
            ]
        }
    },

    // --------------------------------------------------------
    // Observation 4 - Landsat 9 / Berlin
    // --------------------------------------------------------
    {
        observation_id: 4,
        data_product_id: 4,

        satellite: {
            satellite_id: 3,
            satellite_name: "Landsat 9",
            mission: "Landsat Program"
        },

        sensor: {
            sensor_id: 3,
            name: "OLI-2",
            type: "Optical"
        },

        location: {
            geo_location_id: 2,
            area_name: "Berlin",
            country: "Germany",
            region: "Berlin"
        },

        image_metadata: {
            image_type: "Optical Earth Observation",
            format: "GeoTIFF",
            preview_format: "JPEG",
            thumbnail_path: "images/berlin-1.jpeg",
            image_paths: [
                "images/berlin-1.jpeg",
                "images/berlin-2.jpeg"
            ],
            available_visualizations: [
                "true_colour",
                "false_colour"
            ],
            source_product: "LANDSAT_BERLIN_L1"
        },

        spectral_metadata: {
            bands: [
                "Band 1", "Band 2", "Band 3",
                "Band 4", "Band 5", "Band 6",
                "Band 7", "Band 8", "Band 9"
            ],
            band_groups: {
                visible: ["Band 2", "Band 3", "Band 4"],
                near_infrared: ["Band 5"],
                shortwave_infrared: ["Band 6", "Band 7"]
            },
            spatial_resolution_m: [15, 30, 100]
        },

        quality_metadata: {
            quality_flag: "GOOD",
            cloud_assessment: "Very Low",
            cloud_cover_percent: 5.0,
            geometric_quality: "GOOD",
            radiometric_quality: "GOOD"
        },

        processing_metadata: {
            atmospheric_correction: "Not applied",
            cloud_masking: "Available",
            terrain_correction: "Not applied",
            processing_notes: [
                "Level-1 product",
                "Very low cloud coverage"
            ]
        }
    },

    // --------------------------------------------------------
    // Observation 5 - Sentinel-2A / Rome
    // --------------------------------------------------------
    {
        observation_id: 5,
        data_product_id: 5,

        satellite: {
            satellite_id: 1,
            satellite_name: "Sentinel-2A",
            mission: "Copernicus Sentinel-2"
        },

        sensor: {
            sensor_id: 1,
            name: "MSI",
            type: "Multispectral"
        },

        location: {
            geo_location_id: 5,
            area_name: "Rome",
            country: "Italy",
            region: "Lazio"
        },

        image_metadata: {
            image_type: "Multispectral Earth Observation",
            format: "JPEG2000",
            preview_format: "JPEG",
            thumbnail_path: "images/rome-1.jpeg",
            image_paths: [
                "images/rome-1.jpeg",
                "images/rome-2.jpeg"
            ],
            available_visualizations: [
                "true_colour",
                "false_colour"
            ],
            source_product: "S2A_ROME_L1C"
        },

        spectral_metadata: {
            bands: [
                "B01", "B02", "B03", "B04",
                "B05", "B06", "B07", "B08",
                "B8A", "B09", "B10", "B11", "B12"
            ],
            band_groups: {
                visible: ["B02", "B03", "B04"],
                near_infrared: ["B08", "B8A"],
                shortwave_infrared: ["B11", "B12"]
            },
            spatial_resolution_m: [10, 20, 60]
        },

        quality_metadata: {
            quality_flag: "REVIEW",
            cloud_assessment: "High",
            cloud_cover_percent: 45.0,
            geometric_quality: "GOOD",
            radiometric_quality: "GOOD"
        },

        processing_metadata: {
            atmospheric_correction: "Not applied",
            cloud_masking: "Recommended",
            terrain_correction: "Not applied",
            processing_notes: [
                "Level-1C product",
                "High cloud coverage may affect analysis"
            ]
        }
    },

    // --------------------------------------------------------
    // Observation 6 - Sentinel-1A / Bengaluru
    // --------------------------------------------------------
    {
        observation_id: 6,
        data_product_id: 6,

        satellite: {
            satellite_id: 4,
            satellite_name: "Sentinel-1A",
            mission: "Copernicus Sentinel-1"
        },

        sensor: {
            sensor_id: 5,
            name: "C-SAR",
            type: "Synthetic aperture radar"
        },

        location: {
            geo_location_id: 1,
            area_name: "Bengaluru",
            country: "India",
            region: "Karnataka"
        },

        image_metadata: {
            image_type: "Synthetic Aperture Radar",
            format: "GeoTIFF",
            preview_format: "PNG",
            thumbnail_path: "images/bengaluru-1.jpeg",
            image_paths: [
                "images/bengaluru-1.jpeg",
                "images/bengaluru-2.jpeg"
            ],
            available_visualizations: [
                "radar_intensity"
            ],
            source_product: "S1_BENGALURU_GRD"
        },

        spectral_metadata: {
            bands: [
                "VV",
                "VH"
            ],
            frequency_band: "C-band",
            spatial_resolution_m: 10
        },

        quality_metadata: {
            quality_flag: "GOOD",
            cloud_assessment: "Not applicable",
            cloud_cover_percent: 0,
            geometric_quality: "GOOD",
            radiometric_quality: "GOOD"
        },

        processing_metadata: {
            speckle_filtering: "Available",
            terrain_correction: "Recommended",
            atmospheric_correction: "Not applicable",
            processing_notes: [
                "GRD radar product",
                "Radar observation is not affected by optical cloud cover"
            ]
        }
    },

    // --------------------------------------------------------
    // Observation 7 - Landsat 9 / Madrid
    // --------------------------------------------------------
    {
        observation_id: 7,
        data_product_id: 7,

        satellite: {
            satellite_id: 3,
            satellite_name: "Landsat 9",
            mission: "Landsat Program"
        },

        sensor: {
            sensor_id: 3,
            name: "OLI-2",
            type: "Optical"
        },

        location: {
            geo_location_id: 3,
            area_name: "Madrid",
            country: "Spain",
            region: "Community of Madrid"
        },

        image_metadata: {
            image_type: "Optical Earth Observation",
            format: "GeoTIFF",
            preview_format: "JPEG",
            thumbnail_path: "images/madrid-1.jpeg",
            image_paths: [
                "images/madrid-1.jpeg",
                "images/madrid-2.jpeg"
            ],
            available_visualizations: [
                "true_colour",
                "false_colour"
            ],
            source_product: "LANDSAT_MADRID_L1"
        },

        spectral_metadata: {
            bands: [
                "Band 1", "Band 2", "Band 3",
                "Band 4", "Band 5", "Band 6",
                "Band 7", "Band 8", "Band 9"
            ],
            band_groups: {
                visible: ["Band 2", "Band 3", "Band 4"],
                near_infrared: ["Band 5"],
                shortwave_infrared: ["Band 6", "Band 7"]
            },
            spatial_resolution_m: [15, 30, 100]
        },

        quality_metadata: {
            quality_flag: "GOOD",
            cloud_assessment: "Low",
            cloud_cover_percent: 18.0,
            geometric_quality: "GOOD",
            radiometric_quality: "GOOD"
        },

        processing_metadata: {
            atmospheric_correction: "Not applied",
            cloud_masking: "Available",
            terrain_correction: "Not applied",
            processing_notes: [
                "Level-1 product",
                "Suitable for land monitoring"
            ]
        }
    },

    // --------------------------------------------------------
    // Observation 8 - Sentinel-2A / Oslo
    // --------------------------------------------------------
    {
        observation_id: 8,
        data_product_id: 8,

        satellite: {
            satellite_id: 1,
            satellite_name: "Sentinel-2A",
            mission: "Copernicus Sentinel-2"
        },

        sensor: {
            sensor_id: 1,
            name: "MSI",
            type: "Multispectral"
        },

        location: {
            geo_location_id: 4,
            area_name: "Oslo",
            country: "Norway",
            region: "Oslo"
        },

        image_metadata: {
            image_type: "Multispectral Earth Observation",
            format: "JPEG2000",
            preview_format: "JPEG",
            thumbnail_path: "images/oslo-1.jpeg",
            image_paths: [
                "images/oslo-1.jpeg",
                "images/oslo-2.jpeg"
            ],
            available_visualizations: [
                "true_colour",
                "false_colour"
            ],
            source_product: "S2A_OSLO_L1C"
        },

        spectral_metadata: {
            bands: [
                "B01", "B02", "B03", "B04",
                "B05", "B06", "B07", "B08",
                "B8A", "B09", "B10", "B11", "B12"
            ],
            band_groups: {
                visible: ["B02", "B03", "B04"],
                near_infrared: ["B08", "B8A"],
                shortwave_infrared: ["B11", "B12"]
            },
            spatial_resolution_m: [10, 20, 60]
        },

        quality_metadata: {
            quality_flag: "GOOD",
            cloud_assessment: "Low",
            cloud_cover_percent: 9.5,
            geometric_quality: "GOOD",
            radiometric_quality: "GOOD"
        },

        processing_metadata: {
            atmospheric_correction: "Not applied",
            cloud_masking: "Available",
            terrain_correction: "Not applied",
            processing_notes: [
                "Level-1C product",
                "Low cloud contamination"
            ]
        }
    },

    // --------------------------------------------------------
    // Observation 9 - Landsat 9 / Bengaluru
    // --------------------------------------------------------
    {
        observation_id: 9,
        data_product_id: 9,

        satellite: {
            satellite_id: 3,
            satellite_name: "Landsat 9",
            mission: "Landsat Program"
        },

        sensor: {
            sensor_id: 3,
            name: "OLI-2",
            type: "Optical"
        },

        location: {
            geo_location_id: 1,
            area_name: "Bengaluru",
            country: "India",
            region: "Karnataka"
        },

        image_metadata: {
            image_type: "Optical Earth Observation",
            format: "GeoTIFF",
            preview_format: "JPEG",
            thumbnail_path: "images/bengaluru-1.jpeg",
            image_paths: [
                "images/bengaluru-1.jpeg",
                "images/bengaluru-2.jpeg"
            ],
            available_visualizations: [
                "true_colour",
                "false_colour"
            ],
            source_product: "LANDSAT_BENGALURU_L1"
        },

        spectral_metadata: {
            bands: [
                "Band 1", "Band 2", "Band 3",
                "Band 4", "Band 5", "Band 6",
                "Band 7", "Band 8", "Band 9"
            ],
            band_groups: {
                visible: ["Band 2", "Band 3", "Band 4"],
                near_infrared: ["Band 5"],
                shortwave_infrared: ["Band 6", "Band 7"]
            },
            spatial_resolution_m: [15, 30, 100]
        },

        quality_metadata: {
            quality_flag: "ACCEPTABLE",
            cloud_assessment: "Moderate",
            cloud_cover_percent: 30.0,
            geometric_quality: "GOOD",
            radiometric_quality: "GOOD"
        },

        processing_metadata: {
            atmospheric_correction: "Not applied",
            cloud_masking: "Recommended",
            terrain_correction: "Not applied",
            processing_notes: [
                "Level-1 product",
                "Moderate cloud coverage"
            ]
        }
    },

    // --------------------------------------------------------
    // Observation 10 - Sentinel-2A / Berlin
    // --------------------------------------------------------
    {
        observation_id: 10,
        data_product_id: 10,

        satellite: {
            satellite_id: 1,
            satellite_name: "Sentinel-2A",
            mission: "Copernicus Sentinel-2"
        },

        sensor: {
            sensor_id: 1,
            name: "MSI",
            type: "Multispectral"
        },

        location: {
            geo_location_id: 2,
            area_name: "Berlin",
            country: "Germany",
            region: "Berlin"
        },

        image_metadata: {
            image_type: "Multispectral Earth Observation",
            format: "JPEG2000",
            preview_format: "JPEG",
            thumbnail_path: "images/berlin-2.jpeg",
            image_paths: [
                "images/berlin-1.jpeg",
                "images/berlin-2.jpeg"
            ],
            available_visualizations: [
                "true_colour",
                "false_colour"
            ],
            source_product: "S2A_BERLIN_L1C_V2"
        },

        spectral_metadata: {
            bands: [
                "B01", "B02", "B03", "B04",
                "B05", "B06", "B07", "B08",
                "B8A", "B09", "B10", "B11", "B12"
            ],
            band_groups: {
                visible: ["B02", "B03", "B04"],
                near_infrared: ["B08", "B8A"],
                shortwave_infrared: ["B11", "B12"]
            },
            spatial_resolution_m: [10, 20, 60]
        },

        quality_metadata: {
            quality_flag: "GOOD",
            cloud_assessment: "Low",
            cloud_cover_percent: 15.0,
            geometric_quality: "GOOD",
            radiometric_quality: "GOOD"
        },

        processing_metadata: {
            atmospheric_correction: "Not applied",
            cloud_masking: "Available",
            terrain_correction: "Not applied",
            processing_notes: [
                "Level-1C product",
                "Version 2.0 metadata record"
            ]
        }
    },
        // --------------------------------------------------------
    // Observation 11 - Sentinel-2A / Mumbai
    // --------------------------------------------------------
    {
        observation_id: 11,
        data_product_id: 11,

        satellite: {
            satellite_id: 1,
            satellite_name: "Sentinel-2A",
            mission: "Copernicus Sentinel-2"
        },

        sensor: {
            sensor_id: 1,
            name: "MSI",
            type: "Multispectral"
        },

        location: {
            geo_location_id: 6,
            area_name: "Mumbai",
            country: "India",
            region: "Maharashtra"
        },

        image_metadata: {
            image_type: "Multispectral Earth Observation",
            format: "JPEG2000",
            preview_format: "JPEG",
            thumbnail_path: "images/mumbai-1.jpeg",
            image_paths: [
                "images/mumbai-1.jpeg",
                "images/mumbai-2.jpeg"
            ],
            available_visualizations: ["true_colour", "false_colour"],
            source_product: "S2A_MUMBAI_01"
        },

        spectral_metadata: {
            bands: ["B01", "B02", "B03", "B04", "B05", "B06",
                    "B07", "B08", "B8A", "B09", "B10", "B11", "B12"],
            band_groups: {
                visible: ["B02", "B03", "B04"],
                near_infrared: ["B08", "B8A"],
                shortwave_infrared: ["B11", "B12"]
            },
            spatial_resolution_m: [10, 20, 60]
        },

        quality_metadata: {
            quality_flag: "GOOD",
            cloud_assessment: "Low",
            cloud_cover_percent: 10.0,
            geometric_quality: "GOOD",
            radiometric_quality: "GOOD"
        },

        processing_metadata: {
            atmospheric_correction: "Not applied",
            cloud_masking: "Available",
            terrain_correction: "Not applied",
            processing_notes: ["Sample metadata record", "Low cloud coverage"]
        }
    },

    // --------------------------------------------------------
    // Observation 12 - Sentinel-2B / Mumbai
    // --------------------------------------------------------
    {
        observation_id: 12,
        data_product_id: 12,

        satellite: {
            satellite_id: 2,
            satellite_name: "Sentinel-2B",
            mission: "Copernicus Sentinel-2"
        },

        sensor: {
            sensor_id: 2,
            name: "MSI",
            type: "Multispectral"
        },

        location: {
            geo_location_id: 6,
            area_name: "Mumbai",
            country: "India",
            region: "Maharashtra"
        },

        image_metadata: {
            image_type: "Multispectral Earth Observation",
            format: "JPEG2000",
            preview_format: "JPEG",
            thumbnail_path: "images/mumbai-1.jpeg",
            image_paths: ["images/mumbai-1.jpeg", "images/mumbai-2.jpeg"],
            available_visualizations: ["true_colour", "false_colour"],
            source_product: "S2A_MUMBAI_02"
        },

        spectral_metadata: {
            bands: ["B01", "B02", "B03", "B04", "B05", "B06",
                    "B07", "B08", "B8A", "B09", "B10", "B11", "B12"],
            band_groups: {
                visible: ["B02", "B03", "B04"],
                near_infrared: ["B08", "B8A"],
                shortwave_infrared: ["B11", "B12"]
            },
            spatial_resolution_m: [10, 20, 60]
        },

        quality_metadata: {
            quality_flag: "GOOD",
            cloud_assessment: "Low",
            cloud_cover_percent: 15.0,
            geometric_quality: "GOOD",
            radiometric_quality: "GOOD"
        },

        processing_metadata: {
            atmospheric_correction: "Not applied",
            cloud_masking: "Available",
            terrain_correction: "Not applied",
            processing_notes: ["Sample metadata record", "Low cloud coverage"]
        }
    },

    // --------------------------------------------------------
    // Observation 13 - Sentinel-2A / Delhi
    // --------------------------------------------------------
    {
        observation_id: 13,
        data_product_id: 13,

        satellite: {
            satellite_id: 1,
            satellite_name: "Sentinel-2A",
            mission: "Copernicus Sentinel-2"
        },

        sensor: {
            sensor_id: 1,
            name: "MSI",
            type: "Multispectral"
        },

        location: {
            geo_location_id: 7,
            area_name: "Delhi",
            country: "India",
            region: "Delhi"
        },

        image_metadata: {
            image_type: "Multispectral Earth Observation",
            format: "JPEG2000",
            preview_format: "JPEG",
            thumbnail_path: "images/delhi-1.jpeg",
            image_paths: ["images/delhi-1.jpeg", "images/delhi-2.jpeg"],
            available_visualizations: ["true_colour", "false_colour"],
            source_product: "S2A_DELHI_01"
        },

        spectral_metadata: {
            bands: ["B01", "B02", "B03", "B04", "B05", "B06",
                    "B07", "B08", "B8A", "B09", "B10", "B11", "B12"],
            band_groups: {
                visible: ["B02", "B03", "B04"],
                near_infrared: ["B08", "B8A"],
                shortwave_infrared: ["B11", "B12"]
            },
            spatial_resolution_m: [10, 20, 60]
        },

        quality_metadata: {
            quality_flag: "GOOD",
            cloud_assessment: "Very Low",
            cloud_cover_percent: 8.0,
            geometric_quality: "GOOD",
            radiometric_quality: "GOOD"
        },

        processing_metadata: {
            atmospheric_correction: "Not applied",
            cloud_masking: "Available",
            terrain_correction: "Not applied",
            processing_notes: ["Sample metadata record", "Very low cloud coverage"]
        }
    },

    // --------------------------------------------------------
    // Observation 14 - Landsat 9 / Delhi
    // --------------------------------------------------------
    {
        observation_id: 14,
        data_product_id: 14,

        satellite: {
            satellite_id: 3,
            satellite_name: "Landsat 9",
            mission: "Landsat Program"
        },

        sensor: {
            sensor_id: 3,
            name: "OLI-2",
            type: "Optical"
        },

        location: {
            geo_location_id: 7,
            area_name: "Delhi",
            country: "India",
            region: "Delhi"
        },

        image_metadata: {
            image_type: "Optical Earth Observation",
            format: "GeoTIFF",
            preview_format: "JPEG",
            thumbnail_path: "images/delhi-1.jpeg",
            image_paths: ["images/delhi-1.jpeg", "images/delhi-2.jpeg"],
            available_visualizations: ["true_colour", "false_colour"],
            source_product: "S2A_DELHI_02"
        },

        spectral_metadata: {
            bands: ["Band 1", "Band 2", "Band 3", "Band 4",
                    "Band 5", "Band 6", "Band 7", "Band 8", "Band 9"],
            band_groups: {
                visible: ["Band 2", "Band 3", "Band 4"],
                near_infrared: ["Band 5"],
                shortwave_infrared: ["Band 6", "Band 7"]
            },
            spatial_resolution_m: [15, 30, 100]
        },

        quality_metadata: {
            quality_flag: "GOOD",
            cloud_assessment: "Low",
            cloud_cover_percent: 12.0,
            geometric_quality: "GOOD",
            radiometric_quality: "GOOD"
        },

        processing_metadata: {
            atmospheric_correction: "Not applied",
            cloud_masking: "Available",
            terrain_correction: "Not applied",
            processing_notes: ["Sample metadata record", "Optical observation"]
        }
    },

    // --------------------------------------------------------
    // Observation 15 - Sentinel-2A / Chennai
    // --------------------------------------------------------
    {
        observation_id: 15,
        data_product_id: 15,

        satellite: {
            satellite_id: 1,
            satellite_name: "Sentinel-2A",
            mission: "Copernicus Sentinel-2"
        },

        sensor: {
            sensor_id: 1,
            name: "MSI",
            type: "Multispectral"
        },

        location: {
            geo_location_id: 8,
            area_name: "Chennai",
            country: "India",
            region: "Tamil Nadu"
        },

        image_metadata: {
            image_type: "Multispectral Earth Observation",
            format: "JPEG2000",
            preview_format: "JPEG",
            thumbnail_path: "images/chennai-1.jpeg",
            image_paths: ["images/chennai-1.jpeg", "images/chennai-2.jpeg"],
            available_visualizations: ["true_colour", "false_colour"],
            source_product: "S2A_CHENNAI_01"
        },

        spectral_metadata: {
            bands: ["B01", "B02", "B03", "B04", "B05", "B06",
                    "B07", "B08", "B8A", "B09", "B10", "B11", "B12"],
            band_groups: {
                visible: ["B02", "B03", "B04"],
                near_infrared: ["B08", "B8A"],
                shortwave_infrared: ["B11", "B12"]
            },
            spatial_resolution_m: [10, 20, 60]
        },

        quality_metadata: {
            quality_flag: "ACCEPTABLE",
            cloud_assessment: "Moderate",
            cloud_cover_percent: 20.0,
            geometric_quality: "GOOD",
            radiometric_quality: "GOOD"
        },

        processing_metadata: {
            atmospheric_correction: "Not applied",
            cloud_masking: "Available",
            terrain_correction: "Not applied",
            processing_notes: ["Sample metadata record", "Moderate cloud coverage"]
        }
    },

    // --------------------------------------------------------
    // Observation 16 - Sentinel-2B / Chennai
    // --------------------------------------------------------
    {
        observation_id: 16,
        data_product_id: 16,

        satellite: {
            satellite_id: 2,
            satellite_name: "Sentinel-2B",
            mission: "Copernicus Sentinel-2"
        },

        sensor: {
            sensor_id: 2,
            name: "MSI",
            type: "Multispectral"
        },

        location: {
            geo_location_id: 8,
            area_name: "Chennai",
            country: "India",
            region: "Tamil Nadu"
        },

        image_metadata: {
            image_type: "Multispectral Earth Observation",
            format: "JPEG2000",
            preview_format: "JPEG",
            thumbnail_path: "images/chennai-1.jpeg",
            image_paths: ["images/chennai-1.jpeg", "images/chennai-2.jpeg"],
            available_visualizations: ["true_colour", "false_colour"],
            source_product: "S2A_CHENNAI_02"
        },

        spectral_metadata: {
            bands: ["B01", "B02", "B03", "B04", "B05", "B06",
                    "B07", "B08", "B8A", "B09", "B10", "B11", "B12"],
            band_groups: {
                visible: ["B02", "B03", "B04"],
                near_infrared: ["B08", "B8A"],
                shortwave_infrared: ["B11", "B12"]
            },
            spatial_resolution_m: [10, 20, 60]
        },

        quality_metadata: {
            quality_flag: "GOOD",
            cloud_assessment: "Low",
            cloud_cover_percent: 18.0,
            geometric_quality: "GOOD",
            radiometric_quality: "GOOD"
        },

        processing_metadata: {
            atmospheric_correction: "Not applied",
            cloud_masking: "Available",
            terrain_correction: "Not applied",
            processing_notes: ["Sample metadata record", "Low cloud coverage"]
        }
    },

    // --------------------------------------------------------
    // Observation 17 - Sentinel-2A / Helsinki
    // --------------------------------------------------------
    {
        observation_id: 17,
        data_product_id: 17,

        satellite: {
            satellite_id: 1,
            satellite_name: "Sentinel-2A",
            mission: "Copernicus Sentinel-2"
        },

        sensor: {
            sensor_id: 1,
            name: "MSI",
            type: "Multispectral"
        },

        location: {
            geo_location_id: 9,
            area_name: "Helsinki",
            country: "Finland",
            region: "Uusimaa"
        },

        image_metadata: {
            image_type: "Multispectral Earth Observation",
            format: "JPEG2000",
            preview_format: "JPEG",
            thumbnail_path: "images/helsinki-1.jpeg",
            image_paths: ["images/helsinki-1.jpeg", "images/helsinki-2.jpeg"],
            available_visualizations: ["true_colour", "false_colour"],
            source_product: "S2A_HELSINKI_01"
        },

        spectral_metadata: {
            bands: ["B01", "B02", "B03", "B04", "B05", "B06",
                    "B07", "B08", "B8A", "B09", "B10", "B11", "B12"],
            band_groups: {
                visible: ["B02", "B03", "B04"],
                near_infrared: ["B08", "B8A"],
                shortwave_infrared: ["B11", "B12"]
            },
            spatial_resolution_m: [10, 20, 60]
        },

        quality_metadata: {
            quality_flag: "ACCEPTABLE",
            cloud_assessment: "Moderate",
            cloud_cover_percent: 25.0,
            geometric_quality: "GOOD",
            radiometric_quality: "GOOD"
        },

        processing_metadata: {
            atmospheric_correction: "Not applied",
            cloud_masking: "Recommended",
            terrain_correction: "Not applied",
            processing_notes: ["Sample metadata record", "Moderate cloud coverage"]
        }
    },

    // --------------------------------------------------------
    // Observation 18 - Landsat 9 / Helsinki
    // --------------------------------------------------------
    {
        observation_id: 18,
        data_product_id: 18,

        satellite: {
            satellite_id: 3,
            satellite_name: "Landsat 9",
            mission: "Landsat Program"
        },

        sensor: {
            sensor_id: 3,
            name: "OLI-2",
            type: "Optical"
        },

        location: {
            geo_location_id: 9,
            area_name: "Helsinki",
            country: "Finland",
            region: "Uusimaa"
        },

        image_metadata: {
            image_type: "Optical Earth Observation",
            format: "GeoTIFF",
            preview_format: "JPEG",
            thumbnail_path: "images/helsinki-1.jpeg",
            image_paths: ["images/helsinki-1.jpeg", "images/helsinki-2.jpeg"],
            available_visualizations: ["true_colour", "false_colour"],
            source_product: "S2A_HELSINKI_02"
        },

        spectral_metadata: {
            bands: ["Band 1", "Band 2", "Band 3", "Band 4",
                    "Band 5", "Band 6", "Band 7", "Band 8", "Band 9"],
            band_groups: {
                visible: ["Band 2", "Band 3", "Band 4"],
                near_infrared: ["Band 5"],
                shortwave_infrared: ["Band 6", "Band 7"]
            },
            spatial_resolution_m: [15, 30, 100]
        },

        quality_metadata: {
            quality_flag: "ACCEPTABLE",
            cloud_assessment: "Moderate",
            cloud_cover_percent: 30.0,
            geometric_quality: "GOOD",
            radiometric_quality: "GOOD"
        },

        processing_metadata: {
            atmospheric_correction: "Not applied",
            cloud_masking: "Recommended",
            terrain_correction: "Not applied",
            processing_notes: ["Sample metadata record", "Moderate cloud coverage"]
        }
    },

    // --------------------------------------------------------
    // Observation 19 - Sentinel-2A / Moscow
    // --------------------------------------------------------
    {
        observation_id: 19,
        data_product_id: 19,

        satellite: {
            satellite_id: 1,
            satellite_name: "Sentinel-2A",
            mission: "Copernicus Sentinel-2"
        },

        sensor: {
            sensor_id: 1,
            name: "MSI",
            type: "Multispectral"
        },

        location: {
            geo_location_id: 10,
            area_name: "Moscow",
            country: "Russia",
            region: "Moscow Oblast"
        },

        image_metadata: {
            image_type: "Multispectral Earth Observation",
            format: "JPEG2000",
            preview_format: "JPEG",
            thumbnail_path: "images/moscow-1.jpeg",
            image_paths: ["images/moscow-1.jpeg", "images/moscow-2.jpeg"],
            available_visualizations: ["true_colour", "false_colour"],
            source_product: "S2A_MOSCOW_01"
        },

        spectral_metadata: {
            bands: ["B01", "B02", "B03", "B04", "B05", "B06",
                    "B07", "B08", "B8A", "B09", "B10", "B11", "B12"],
            band_groups: {
                visible: ["B02", "B03", "B04"],
                near_infrared: ["B08", "B8A"],
                shortwave_infrared: ["B11", "B12"]
            },
            spatial_resolution_m: [10, 20, 60]
        },

        quality_metadata: {
            quality_flag: "REVIEW",
            cloud_assessment: "High",
            cloud_cover_percent: 35.0,
            geometric_quality: "GOOD",
            radiometric_quality: "GOOD"
        },

        processing_metadata: {
            atmospheric_correction: "Not applied",
            cloud_masking: "Recommended",
            terrain_correction: "Not applied",
            processing_notes: ["Sample metadata record", "High cloud coverage"]
        }
    },

    // --------------------------------------------------------
    // Observation 20 - Landsat 9 / Moscow
    // --------------------------------------------------------
    {
        observation_id: 20,
        data_product_id: 20,

        satellite: {
            satellite_id: 3,
            satellite_name: "Landsat 9",
            mission: "Landsat Program"
        },

        sensor: {
            sensor_id: 3,
            name: "OLI-2",
            type: "Optical"
        },

        location: {
            geo_location_id: 10,
            area_name: "Moscow",
            country: "Russia",
            region: "Moscow Oblast"
        },

        image_metadata: {
            image_type: "Optical Earth Observation",
            format: "GeoTIFF",
            preview_format: "JPEG",
            thumbnail_path: "images/moscow-1.jpeg",
            image_paths: ["images/moscow-1.jpeg", "images/moscow-2.jpeg"],
            available_visualizations: ["true_colour", "false_colour"],
            source_product: "S2A_MOSCOW_02"
        },

        spectral_metadata: {
            bands: ["Band 1", "Band 2", "Band 3", "Band 4",
                    "Band 5", "Band 6", "Band 7", "Band 8", "Band 9"],
            band_groups: {
                visible: ["Band 2", "Band 3", "Band 4"],
                near_infrared: ["Band 5"],
                shortwave_infrared: ["Band 6", "Band 7"]
            },
            spatial_resolution_m: [15, 30, 100]
        },

        quality_metadata: {
            quality_flag: "ACCEPTABLE",
            cloud_assessment: "Moderate",
            cloud_cover_percent: 28.0,
            geometric_quality: "GOOD",
            radiometric_quality: "GOOD"
        },

        processing_metadata: {
            atmospheric_correction: "Not applied",
            cloud_masking: "Recommended",
            terrain_correction: "Not applied",
            processing_notes: ["Sample metadata record", "Moderate cloud coverage"]
        }
    }
]);

// ============================================================
// INDEX
// ============================================================

db.observation_metadata.createIndex(
    { observation_id: 1 },
    { unique: true }
);

// Useful for quality/cloud-cover filtering
db.observation_metadata.createIndex(
    { "quality_metadata.cloud_cover_percent": 1 }
);

// Useful for filtering by satellite
db.observation_metadata.createIndex(
    { "satellite.satellite_id": 1 }
);

// ============================================================
// VERIFICATION
// ============================================================

print("MongoDB database: satellite_geo_repository");
print("Collection: observation_metadata");
print(
    "Documents inserted: " +
    db.observation_metadata.countDocuments()
);

print("Indexes:");
printjson(db.observation_metadata.getIndexes());

print("Sample document:");
printjson(db.observation_metadata.findOne());