const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});


// Define schema for messages
const messageSchema = new mongoose.Schema({
  name: String,
  message: String
});

// Create Message model
const Message = mongoose.model('Message', messageSchema);

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the livechat.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'livechat.html'));
});

// API endpoint to retrieve messages
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to save a message
app.post('/messages', async (req, res) => {
  try {
    const { name, message } = req.body;
    const newMessage = new Message({ name, message });
    await newMessage.save();
    res.status(201).json({ message: 'Message saved successfully' });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
