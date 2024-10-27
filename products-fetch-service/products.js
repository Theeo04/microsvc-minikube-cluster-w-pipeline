const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

app.use(cors());

dotenv.config(); // Load environment variables from .env file
const PORT = 3002; // Use environment variable or default to 3002

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection using environment variables
const mongoUri = process.env.MONGO_CONN_STR_PRODUCTS;

mongoose.connect(mongoUri)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

const ProductSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
    price: { type: Number, required: true },
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

const Product = mongoose.model('Product', ProductSchema);

// API endpoint to fetch all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products); // Corrected response from "users" to "products"
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
});

app.get('/test', async (req, res) => {
    try {
        res.status(200).json("ok"); // Corrected response from "users" to "products"
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
})

// Start the server
app.listen(PORT, () => {
    console.log(`Product Service running on port ${PORT}, LINK: http://localhost:${PORT}/`);
});