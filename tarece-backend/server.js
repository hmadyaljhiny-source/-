const express = require('express');
const pool = require('./db');
const app = express();
app.use (express.json());
const userRouter = require('./routes/User');
app.use('/users', userRouter);
const stationRouter = require('./routes/station');
app.use('/stations', stationRouter);

app.listen(3000,()=>{
    console.log('server is running on port 3000');
});