// server.js

// 1. Load environment variables FIRST
require('dotenv').config();

// 2. Import Express and the database connection
const express = require('express');
const connectDB = require('./config/db'); 

// 3. Initialize the Express application
const app = express();

// 4. Execute the database connection
connectDB();

// 5. GLOBAL MIDDLEWARE
// This allows our app to accept and parse incoming JSON data in the request body
app.use(express.json());

// 6. ROUTES
// Express replaces the if/else logic with clean routing methods (app.get, app.post, etc.)
app.get('/ping', (req, res) => {
    // Sending a response is much simpler now
    res.status(200).json({ 
        status: "ok", 
        message: "Express server is running smoothly!" 
    });
});

// 7. 404 HANDLER (Fallback Middleware)
// If the incoming request doesn't match any route above, it falls down to this middleware
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found" });
});

// 8. Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Express server is running on port ${PORT}...`);
});