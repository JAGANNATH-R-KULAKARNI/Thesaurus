const express=require('express');
const mongoose=require('mongoose');
const morgan=require('morgan');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const expressValidator=require('express-validator');

require('dotenv').config()

const authRoutes=require('./Routes/auth');
const userRoutes=require('./Routes/user');

const app=express()

mongoose.connect(process.env.DATABASE,{
  useNewUrlParser : true
})
.then(()=>{
    console.log("Database connected vro")
});

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use('/api',authRoutes)
app.use('/api',userRoutes);

const port=process.env.PORT || 8000;

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
});