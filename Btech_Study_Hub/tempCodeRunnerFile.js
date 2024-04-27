const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3050;
const mongoUri = 'mongodb://localhost:27017/';
const dbName = 'liveChatBSH';

// Connect to MongoDB
let db;
async function connectToDatabase() {
    const client = new MongoClient(mongoUri, { useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db(dbName);
}
connectToDatabase().catch(console.error);

// Serve static files from the current directory
app.use(express.static(__dirname));

// Parse JSON bodies
app.use(express.json());

// Route for handling review submissions
app.post('/review', async (req, res) => {
    const { name, opinion, rating } = req.body;
    if (!name || !opinion || !rating) {
        return res.status(400).send('Name, opinion, and rating are required');
    }
    try {
        // Store review in MongoDB
        await db.collection('reviews').insertOne({ name, opinion, rating });
        res.sendStatus(200);
    } catch (error) {
        console.error('Error storing review:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route for retrieving reviews
app.get('/review', async (req, res) => {
    try {
        // Retrieve reviews from MongoDB
        const reviews = await db.collection('reviews').find().toArray();
        res.json(reviews);
    } catch (error) {
        console.error('Error retrieving reviews:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route for deleting a review
app.post('/deleteReview', async (req, res) => {
    const { name, opinion, rating } = req.body;
    if (!name || !opinion || !rating) {
        return res.status(400).send('Name, opinion, and rating are required');
    }
    try {
        // Delete review from MongoDB
        await db.collection('reviews').deleteOne({ name, opinion, rating });
        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
