const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//Test route
app.get('/', (req, res) => {
    res.send('API is running...');
});

//Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})