const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const port = 8080;

// Swagger definition
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API Node JS',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
    components: {
    securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT', 
        },
    },
},
    },
    apis: ['./api/routes/*.js'], // Path to your API docs
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Konfigurasi MongoDB
mongoose.connect(
    'mongodb+srv://node-shop:' + process.env.MONGO_ATLAS_PW + '@node-rest-shop.lusvh.mongodb.net/?retryWrites=true&w=majority&appName=node-rest-shop'
)

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(`Incoming req: ${req.method} ${req.url}`);
    next();
})

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


const productRouters = require('./api/routes/products');
const orderRouters = require('./api/routes/orders');
const userRouters = require('./api/routes/user');

// Daftar Routes
app.use('/products', productRouters);
app.use('/orders', orderRouters);
app.use('/user', userRouters);

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