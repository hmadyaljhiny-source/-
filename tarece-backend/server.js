const express = require('express');
const cors = require('cors'); 
const app = express();
const stationRoutes = require('./routes/station');
const userRoutes = require('./routes/User');

app.use(cors()); // السماح بالاتصال من الفرونت إند بدون حظر
app.use(express.json());

// توجيه المسارات الأساسية
app.use('/stations', stationRoutes);
app.use('/users', userRoutes);

app.listen(3000, () => {
    console.log('✅ Server is running successfully on port 3000');
});
