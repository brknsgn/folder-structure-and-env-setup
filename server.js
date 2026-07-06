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

// Import routes
const transactions = require('./src/routes/transactionRoutes');

// Mount routes
app.use('/transactions', transactions);

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

// 8. Error Handling Middleware
const errorHandler = require('./src/middlewares/errorMiddleware');


// 8.1. Mount regular routes
app.use('/transactions', transactions);

// 8.2. Mount the 404 fallback
app.use((req, res, next) => {
    const error = new Error('Endpoint not found');
    res.status(404);
    next(error); // Pass this 404 error down to the error handler
});

// 8.3. Mount the Error Handler (MUST BE THE VERY LAST app.use())
app.use(errorHandler);
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
// 9. Start the server

app.listen(PORT, () => {
    console.log(`Express server is running on port ${PORT}...`);
});



