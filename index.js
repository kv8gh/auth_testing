const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./auth');
const path = require('path')
const  userRoutes = require('./routes/userRoutes');
const userResponses = require('./routes/userResponses')

const app = express();
const PORT = process.env.PORT || 3000;

require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(express.static('public'))

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

app.use('/user', userRoutes);
app.use('/question',userResponses);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
