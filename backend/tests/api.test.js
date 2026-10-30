
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

const BASE_URL =
    process.env.API_BASE_URL || 'http://localhost:3001/api';

const EMAIL = process.env.API_TEST_EMAIL;
const PASSWORD = process.env.API_TEST_PASSWORD;

let token = null;

// --------------------------------------------------
// Helper: Send API requests
// --------------------------------------------------

async function request(path, options = {}) {
    const { auth = false, ...fetchOptions } = options;

    const headers = {
        ...(fetchOptions.body
            ? { 'Content-Type': 'application/json' }
            : {}),
        ...(auth && token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        ...fetchOptions.headers
    };

    return fetch(`${BASE_URL}${path}`, {
        ...fetchOptions,
        headers
    });
}

// --------------------------------------------------
// Helper: Extract arrays from API responses
// --------------------------------------------------

function extractArray(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (data && typeof data === 'object') {
        const possibleArrays = [
            data.data,
            data.metadata,
            data.results,
            data.observations,
            data.items
        ];

        return possibleArrays.find(Array.isArray) || null;
    }

    return null;
}

// --------------------------------------------------
// Login before running authenticated tests
// --------------------------------------------------

before(async () => {
    if (!EMAIL || !PASSWORD) {
        console.log(
            '\nTest credentials not provided. ' +
            'Authenticated tests will be skipped.\n'
        );
        return;
    }

    try {
        const response = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: EMAIL,
                password: PASSWORD
            })
        });

        const data = await response.json();

        if (response.ok && data.token) {
            token = data.token;
            console.log('\nTest login successful.\n');
        } else {
            console.log(
                '\nTest login failed. Authenticated tests will be skipped.',
                data
            );
        }
    } catch (error) {
        console.log(
            '\nCould not connect to backend:',
            error.message
        );
    }
});

// --------------------------------------------------
// API 01: Health check
// --------------------------------------------------

test('API 01 - Health endpoint returns 200', async () => {
    const response = await request('/health');

    assert.equal(response.status, 200);

    const data = await response.json();

    assert.equal(data.success, true);
});

// --------------------------------------------------
// API 02: Valid login
// --------------------------------------------------

test('API 02 - Valid login returns a JWT token', async (t) => {
    if (!EMAIL || !PASSWORD) {
        t.skip('Test credentials not provided');
        return;
    }

    const response = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email: EMAIL,
            password: PASSWORD
        })
    });

    assert.equal(response.status, 200);

    const data = await response.json();

    assert.ok(data.token);
    assert.ok(data.user);
});

// --------------------------------------------------
// API 03: Invalid login
// --------------------------------------------------

test('API 03 - Invalid login is rejected', async () => {
    const response = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email: 'invalid-user@example.com',
            password: 'WrongPassword123'
        })
    });

    assert.equal(response.status, 401);
});

// --------------------------------------------------
// API 04: Login with missing fields
// --------------------------------------------------

test('API 04 - Login rejects missing credentials', async () => {
    const response = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email: 'test@example.com'
        })
    });

    assert.equal(response.status, 400);
});

// --------------------------------------------------
// API 05: Observations require authentication
// --------------------------------------------------

test('API 05 - Observations reject unauthenticated requests', async () => {
    const response = await request('/observations');

    assert.equal(response.status, 401);
});

// --------------------------------------------------
// API 06: Get all observations
// --------------------------------------------------

test('API 06 - Authenticated user can retrieve observations', async (t) => {
    if (!token) {
        t.skip('Authentication token unavailable');
        return;
    }

    const response = await request('/observations', {
        auth: true
    });

    assert.equal(response.status, 200);

    const data = await response.json();
    const records = extractArray(data);

    assert.ok(records, 'Expected an observations array');
    assert.equal(records.length, 20);
});

// --------------------------------------------------
// API 07: Get all satellites
// --------------------------------------------------

test('API 07 - Authenticated user can retrieve satellites', async (t) => {
    if (!token) {
        t.skip('Authentication token unavailable');
        return;
    }

    const response = await request('/satellites', {
        auth: true
    });

    assert.equal(response.status, 200);

    const data = await response.json();
    const records = extractArray(data);

    assert.ok(records, 'Expected a satellites array');
    assert.ok(records.length > 0);
});

// --------------------------------------------------
// API 08: Get observation by ID
// --------------------------------------------------

test('API 08 - Retrieve observation by valid ID', async (t) => {
    if (!token) {
        t.skip('Authentication token unavailable');
        return;
    }

    const response = await request('/observations/1', {
        auth: true
    });

    assert.equal(response.status, 200);

    const data = await response.json();

    assert.ok(data);
});

// --------------------------------------------------
// API 09: Invalid observation ID
// --------------------------------------------------

test('API 09 - Invalid observation ID is rejected', async (t) => {
    if (!token) {
        t.skip('Authentication token unavailable');
        return;
    }

    const response = await request('/observations/abc', {
        auth: true
    });

    assert.equal(response.status, 400);
});

// --------------------------------------------------
// API 10: Get all MongoDB metadata
// --------------------------------------------------

test('API 10 - Metadata endpoint returns metadata records', async () => {
    const response = await request('/metadata');

    assert.equal(response.status, 200);

    const data = await response.json();
    const records = extractArray(data);

    assert.ok(
        records,
        `Expected metadata array. Received: ${JSON.stringify(data)}`
    );

    assert.equal(records.length, 20);
});

// --------------------------------------------------
// API 11: Get metadata by ID
// --------------------------------------------------

test('API 11 - Retrieve metadata by valid ID', async () => {
    const response = await request('/metadata/1');

    assert.equal(response.status, 200);

    const data = await response.json();

    assert.ok(data);
});

// --------------------------------------------------
// API 12: Search metadata by location
// --------------------------------------------------

test('API 12 - Search metadata by location', async () => {
    const response = await request(
        '/metadata/search/location?location=Mumbai'
    );

    assert.equal(response.status, 200);

    const data = await response.json();
    const records = extractArray(data);

    assert.ok(
        records,
        `Expected metadata array. Received: ${JSON.stringify(data)}`
    );

    assert.ok(
        records.length > 0,
        'Expected metadata records for Mumbai'
    );
});

// --------------------------------------------------
// API 13: Location search without parameter
// --------------------------------------------------

test('API 13 - Location search rejects missing location', async () => {
    const response = await request(
        '/metadata/search/location'
    );

    assert.equal(response.status, 400);
});

// --------------------------------------------------
// API 14: Invalid metadata ID
// --------------------------------------------------

test('API 14 - Invalid metadata ID is rejected', async () => {
    const response = await request('/metadata/abc');

    assert.equal(response.status, 400);
});

// --------------------------------------------------
// API 15: Provenance requires authentication
// --------------------------------------------------

test('API 15 - Provenance rejects unauthenticated requests', async () => {
    const response = await request('/provenance/1');

    assert.equal(response.status, 401);
});

// --------------------------------------------------
// API 16: Retrieve provenance
// --------------------------------------------------

test('API 16 - Authenticated user can retrieve provenance', async (t) => {
    if (!token) {
        t.skip('Authentication token unavailable');
        return;
    }

    const response = await request('/provenance/12', {
        auth: true
    });

    assert.equal(response.status, 200);

    const result = await response.json();

    assert.equal(result.success, true);
    assert.ok(Array.isArray(result.data));
});
// --------------------------------------------------
// API 17: Unknown endpoint
// --------------------------------------------------

test('API 17 - Unknown endpoint returns 404', async () => {
    const response = await request(
        '/this-endpoint-does-not-exist'
    );

    assert.equal(response.status, 404);
});

// --------------------------------------------------
// Test completion
// --------------------------------------------------

after(() => {
    console.log('\nAPI test execution completed.\n');
});
