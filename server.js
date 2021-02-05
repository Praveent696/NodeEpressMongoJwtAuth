const express = require('express');
const connectDB = require('./config/db');

const app = express();


const PORT = process.env.PORT || 5000;
connectDB();

app.use(express.json()); //Used to parse JSON bodies

app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))

app.get('/',(req,res)=> res.status(200).json({message: 'Welcome to devconnect api'}) )

app.listen(PORT, ()=>{
    console.log(`server started on port ${PORT}`)
})