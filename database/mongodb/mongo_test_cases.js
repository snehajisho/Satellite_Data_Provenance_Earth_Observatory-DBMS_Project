
// MongoDB Test Cases
// Satellite Data Provenance & Earth Observation Repository

use("satellite_geo_repository");

const collection = db.observation_metadata;

let passed = 0;
let failed = 0;

function test(name, condition) {
    if (condition) {
        print("PASS: " + name);
        passed++;
    } else {
        print("FAIL: " + name);
        failed++;
    }
}

print("\n===== MONGODB TEST CASES =====\n");

// TC-M01: Check collection exists
const collectionExists =
    db.getCollectionNames().includes("observation_metadata");

test("TC-M01 Collection exists", collectionExists);

if (collectionExists) {

    // TC-M02: Check document count
    const totalDocuments = collection.countDocuments();

    test("TC-M02 Total documents are 20",
        totalDocuments === 20);

    // TC-M03: Check observation IDs 1-20
    const ids = collection.distinct("observation_id")
        .sort((a, b) => a - b);

    const expectedIds =
        Array.from({ length: 20 }, (_, i) => i + 1);

    const allIdsPresent =
        expectedIds.every((id, index) => ids[index] === id)
        && ids.length === 20;

    test("TC-M03 Observation IDs 1-20 exist",
        allIdsPresent);

    // TC-M04: Check duplicate observation IDs
    const duplicates = collection.aggregate([
        {
            $group: {
                _id: "$observation_id",
                count: { $sum: 1 }
            }
        },
        {
            $match: { count: { $gt: 1 } }
        }
    ]).toArray();

    test("TC-M04 No duplicate observation IDs",
        duplicates.length === 0);

    // TC-M05: Check missing observation IDs
    const missingIds = collection.countDocuments({
        $or: [
            { observation_id: { $exists: false } },
            { observation_id: null }
        ]
    });

    test("TC-M05 All documents have observation IDs",
        missingIds === 0);

    // TC-M06: Check location metadata
    const missingLocations = collection.countDocuments({
        $or: [
            { "location.area_name": { $exists: false } },
            { "location.area_name": null },
            { "location.area_name": "" }
        ]
    });

    test("TC-M06 All documents have location names",
        missingLocations === 0);

    // TC-M07: Check five new locations
    const newLocations = [
        "Mumbai",
        "Delhi",
        "Chennai",
        "Helsinki",
        "Moscow"
    ];

    const locationCounts = collection.aggregate([
        {
            $match: {
                "location.area_name": {
                    $in: newLocations
                }
            }
        },
        {
            $group: {
                _id: "$location.area_name",
                count: { $sum: 1 }
            }
        }
    ]).toArray();

    const countMap = {};

    locationCounts.forEach(item => {
        countMap[item._id] = item.count;
    });

    const locationsCorrect =
        newLocations.every(name => countMap[name] === 2);

    test("TC-M07 Five new locations have two documents each",
        locationsCorrect);

    // TC-M08: Check blank location names
    const blankLocations = collection.countDocuments({
        "location.area_name": { $in: ["", null] }
    });

    test("TC-M08 No blank location names",
        blankLocations === 0);

    // TC-M09: Check image metadata coverage
    const imageMetadataCount = collection.countDocuments({
        image_metadata: { $exists: true, $ne: null }
    });

    print(
        "INFO: TC-M09 Image metadata found in " +
        imageMetadataCount + "/" + totalDocuments + " documents"
    );

    // TC-M10: Display new location mappings
    print("\n===== NEW LOCATION MAPPINGS =====");

    collection.find(
        {
            "location.area_name": {
                $in: newLocations
            }
        },
        {
            _id: 0,
            observation_id: 1,
            "location.area_name": 1
        }
    ).sort({ observation_id: 1 }).forEach(printjson);
}

// Final summary
print("\n===== TEST SUMMARY =====");
print("Passed: " + passed);
print("Failed: " + failed);
print("Total: " + (passed + failed));

if (failed === 0) {
    print("\nRESULT: ALL TESTS PASSED");
} else {
    print("\nRESULT: SOME TESTS FAILED");
}
