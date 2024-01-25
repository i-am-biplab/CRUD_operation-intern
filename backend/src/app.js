require('dotenv').config();
const express = require("express");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require('./routes/productRoutes');

const port = process.env.PORT || 8000;

const app = express();

app.use(cors());    // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/user', productRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});