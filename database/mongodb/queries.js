// ============================================
// MongoDB Queries
// Database: satellite_geo_repository
// Collection: observation_metadata
// ============================================

const db = db.getSiblingDB("satellite_geo_repository");

// ============================================
// Q1. Display all observation metadata
// ============================================

db.observation_metadata.find().pretty();


// ============================================
// Q2. Find metadata for a specific observation
// Observation IDs: 1 - 10
// ============================================

db.observation_metadata.findOne({
    observation_id: 1
});


// ============================================
// Q3. Find observations from a specific satellite
// Example: Sentinel-2A
// ============================================

db.observation_metadata.find({
    "satellite.satellite_name": "Sentinel-2A"
}).pretty();


// ============================================
// Q4. Find observations from a specific location
// Example: Berlin
// ============================================

db.observation_metadata.find({
    "location.area_name": "Berlin"
}).pretty();


// ============================================
// Q5. Find observations with low cloud cover
// Cloud cover below 20%
// ============================================

db.observation_metadata.find({
    "quality_metadata.cloud_cover_percent": {
        $lt: 20
    }
}).pretty();


// ============================================
// Q6. Find high-quality observations
// ============================================

db.observation_metadata.find({
    "quality_metadata.quality_flag": "GOOD"
}).pretty();


// ============================================
// Q7. Find observations containing a particular
// spectral band
// Example: B08
// ============================================

db.observation_metadata.find({
    "spectral_metadata.bands": "B08"
}).pretty();


// ============================================
// Q8. Find observations where cloud masking
// is available
// ============================================

db.observation_metadata.find({
    "processing_metadata.cloud_masking": "Available"
}).pretty();


// ============================================
// Q9. Count observations for each satellite
// ============================================

db.observation_metadata.aggregate([
    {
        $group: {
            _id: "$satellite.satellite_name",
            observation_count: {
                $sum: 1
            }
        }
    },
    {
        $sort: {
            observation_count: -1
        }
    }
]);


// ============================================
// Q10. Average cloud cover by location
// ============================================

db.observation_metadata.aggregate([
    {
        $group: {
            _id: "$location.area_name",
            average_cloud_cover: {
                $avg: "$quality_metadata.cloud_cover_percent"
            }
        }
    },
    {
        $sort: {
            average_cloud_cover: -1
        }
    }
]);


// ============================================
// Q11. Find observations with cloud cover
// above the overall average
// ============================================

db.observation_metadata.aggregate([
    {
        $group: {
            _id: null,
            average_cloud_cover: {
                $avg: "$quality_metadata.cloud_cover_percent"
            }
        }
    },
    {
        $lookup: {
            from: "observation_metadata",
            pipeline: [],
            as: "observations"
        }
    },
    {
        $unwind: "$observations"
    },
    {
        $match: {
            $expr: {
                $gt: [
                    "$observations.quality_metadata.cloud_cover_percent",
                    "$average_cloud_cover"
                ]
            }
        }
    },
    {
        $project: {
            _id: 0,
            observation_id: "$observations.observation_id",
            cloud_cover_percent:
                "$observations.quality_metadata.cloud_cover_percent",
            quality_flag:
                "$observations.quality_metadata.quality_flag"
        }
    },
    {
        $sort: {
            cloud_cover_percent: -1
        }
    }
]);


// ============================================
// Q12. Find observations from a specific country
// Example: Germany
// ============================================

db.observation_metadata.find({
    "location.country": "Germany"
}).pretty();


// ============================================
// Q13. Show observation, location and image
// information
// ============================================

db.observation_metadata.find(
    {},
    {
        _id: 0,
        observation_id: 1,
        satellite: 1,
        location: 1,
        image_metadata: 1
    }
).pretty();


// ============================================
// Q14. Search observations by place name
// Case-insensitive
// Example: berlin
// ============================================

db.observation_metadata.find({
    "location.area_name": {
        $regex: "berlin",
        $options: "i"
    }
}).pretty();


// ============================================
// Q15. Find all observations for a satellite
// and location combination
// Example: Sentinel-2A in Berlin
// ============================================

db.observation_metadata.find({
    "satellite.satellite_name": "Sentinel-2A",
    "location.area_name": "Berlin"
}).pretty();


// ============================================
// Q16. Show available images for a location
// Example: Oslo
// ============================================

db.observation_metadata.find(
    {
        "location.area_name": "Oslo"
    },
    {
        _id: 0,
        observation_id: 1,
        location: 1,
        image_metadata: 1
    }
).pretty();