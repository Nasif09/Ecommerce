const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const userRouter = require('./router/userRouter');
const seedRouter = require('./router/seedRouter');
const { errorResponse } = require('./controllers/responseController');

const app = express();

const rateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,//1 minitue
    max: 5,
    message: 'To many requests from this IP. Please try again later',
})

app.use(rateLimiter);
app.use(xssClean());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', userRouter)
app.use('/api/seed', seedRouter)


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