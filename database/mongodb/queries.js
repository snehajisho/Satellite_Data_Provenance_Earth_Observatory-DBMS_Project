// ============================================
// MongoDB Queries
// Database: satellite_geo_repository
// Collection: observation_metadata
// ============================================

// 1. Display all observation metadata
db.observation_metadata.find().pretty();

// 2. Find metadata for a specific observation
db.observation_metadata.findOne({
    observation_id: 101
});

// 3. Find observations from a specific satellite
db.observation_metadata.find({
    "satellite.satellite_id": 1
}).pretty();

// 4. Find observations with low cloud cover
db.observation_metadata.find({
    "quality_metadata.cloud_cover_percent": {
        $lt: 20
    }
}).pretty();

// 5. Find high-quality observations
db.observation_metadata.find({
    "quality_metadata.quality_flag": "GOOD"
}).pretty();

// 6. Find observations containing a particular spectral band
db.observation_metadata.find({
    spectral_bands: "B08"
}).pretty();

// 7. Find observations processed using cloud masking
db.observation_metadata.find({
    processing_metadata: {
        $elemMatch: {
            $regex: "cloud masking",
            $options: "i"
        }
    }
}).pretty();

// 8. Count observations for each satellite
db.observation_metadata.aggregate([
    {
        $group: {
            _id: "$satellite.satellite_id",
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

// 9. Average cloud cover by satellite
db.observation_metadata.aggregate([
    {
        $group: {
            _id: "$satellite.satellite_id",
            average_cloud_cover: {
                $avg: "$quality_metadata.cloud_cover_percent"
            }
        }
    },
    {
        $sort: {
            average_cloud_cover: 1
        }
    }
]);

// 10. Show observations with image information
db.observation_metadata.find(
    {},
    {
        _id: 0,
        observation_id: 1,
        satellite: 1,
        image: 1
    }
).pretty();