const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

// Connect to the test database before running tests

describe('Transaction API', () => { // Group related tests for the Transaction API
    afterAll(async () => {
        if (mongoose.connection.readyState === 1) { // Check if the connection is open
            await mongoose.connection.close(); // Close the connection if it's open
        }
    
    });

    it('GET /transactions - should return a list of transactions with a 200 status', async () => { // Test the GET /transactions endpoint
        const res = await request(app).get('/transactions'); // Make a GET request to the /transactions endpoint

        expect(res.statusCode).toBe(200); // Assert that the response status code is 200 (OK)
        expect(res.body.success).toBe(true); // Assert that the success field in the response body is true
        expect(Array.isArray(res.body.data)).toBe(true); // Assert that the data field in the response body is an array
    });

});
