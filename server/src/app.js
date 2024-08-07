require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const userRouter = require('./router/userRouter');
const seedRouter = require('./router/seedRouter');
const { errorResponse } = require('./controllers/responseController');
const authRouter = require('./router/authRouter');
const categoryRouter = require('./router/categoryRouter');
const productRouter = require('./router/productRouter');
var cors = require('cors');

const app = express();
app.use(cors());

// const rateLimiter = rateLimit({
//     windowMs: 1 * 60 * 1000,//1 minitue
//     max: 5,
//     message: 'To many requests from this IP. Please try again later',
// })

app.use(cookieParser()); 
// app.use(rateLimiter);
app.use(xssClean());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/seed', seedRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/products', productRouter)


const isLoggedIn = (req,res,next) => {
    console.log("middleware test");
}

app.get("/test", (req, res) => {
    res.status(200).send({
        message: 'api test',
    });
})


//client error handling
app.use((req,res,next) => {
    next(createError(401, 'route not found'));
})

//server error handling
app.use((err, req, res, next) => {
    return errorResponse(res, {
        statusCode: err.status,
        message: err.message,
    })
})



module.exports = app;