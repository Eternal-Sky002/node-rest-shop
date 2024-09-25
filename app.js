const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRouters = require('./api/routes/products');
const orderRouters = require('./api/routes/orders');

// Konfigurasi MongoDB
mongoose.connect(
    'mongodb+srv://node-shop:' + process.env.MONGO_ATLAS_PW + '@node-rest-shop.lusvh.mongodb.net/?retryWrites=true&w=majority&appName=node-rest-shop'
)

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Konfigurasi CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Headers', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Daftar Routes
app.use('/products', productRouters);
app.use('/orders', orderRouters);

// Error Handle
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;