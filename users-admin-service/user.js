const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

app.use(cors());
// CORS configuration
// const corsOptions = {
//     origin: 'http://localhost:31309', // Update this to your frontend URL 
//     methods: 'GET,POST,OPTIONS',
//     allowedHeaders: 'Content-Type,Authorization',
//   };

dotenv.config(); // Load environment variables from .env file
const PORT = 3001; // Use environment variable or default to 3001

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection using environment variables
const mongoUri = process.env.MONGO_CONN_STR;

// Connect to MongoDB with authentication (removed deprecated options)
mongoose.connect(mongoUri)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));


// Define a User schema and model
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

const User = mongoose.model('User', UserSchema);

// Endpoint for registration
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Create a new user
        const user = new User({ name, email, password });
        await user.save();

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Endpoint for login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });

        // Check if user exists and password matches
        if (user && user.password === password) {
            res.status(200).json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// Start the server
app.listen(PORT, () => console.log(`User Service running on port ${PORT}, LINK: http://localhost:${PORT}/`));
