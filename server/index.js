const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const connectDB = require('./config/db');
const quadrantClient = require('./config/qdrantClient');
connectDB();

app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/employee', require('./routes/employeeRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});