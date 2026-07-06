// src/middlewares/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
    // Log the error for the developer in the console
    console.error(err.stack);

    // Set a default status code (500 Internal Server Error) if none is provided
    const statusCode = res.statusCode ? res.statusCode : 500;

    // Send a unified, consistent JSON response
    res.status(statusCode).json({
        success: false,
        error: err.message || 'Server Error'
    });
};

module.exports = errorHandler;