const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to log request details
app.use((req, res, next) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        ip: req.ip,
        url: req.originalUrl,
        protocol: req.protocol,
        method: req.method,
        hostname: req.hostname
    };

    const logFilePath = path.join(__dirname, 'requests.log');

    // Append log entry to file
    fs.appendFile(logFilePath, JSON.stringify(logEntry) + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });

    next();
});

// Basic routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/about', (req, res) => {
    res.send('About Page');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
