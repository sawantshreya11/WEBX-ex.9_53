const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Store registered users (in memory)
const registeredUsers = new Map(); // Changed from Set to Map to store all user data

// Serve the registration page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle registration
app.post('/register', (req, res) => {
    try {
        const { username, name, college, password } = req.body;
        
        // Check if username already exists
        if (registeredUsers.has(username)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Username already exists' 
            });
        }
        
        // Add new user with all their data
        registeredUsers.set(username, {
            name,
            college,
            password,
            registrationDate: new Date()
        });
        
        // Return success response with the stored data
        res.json({ 
            success: true, 
            message: 'Successfully Registered',
            data: {
                username,
                name,
                college,
                registrationDate: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error occurred'
        });
    }
});

// Get all registered users (for testing)
app.get('/users', (req, res) => {
    res.json(Array.from(registeredUsers.entries()));
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 