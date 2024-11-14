const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/products');

router.get('/', (req, res, next) => {
    Product.find()
    // memilih objek apa saja yang tampil
    .select("name price _id")
    .exec()
    .then(docs => {
        const response = {
            // menambah objek count untuk melihat jumlah data
            count: docs.length,
            // menambah objek request per product agar bisa diarahkan ke request get by id
            products: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + doc._id
                    }
                };
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            message: err
        });
    });
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    })
    product
    .save()
    .then(result => {
        res.status(201).json({
            message: 'Handling POST requests to /products',
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json({
                _id: doc.id,
                name: doc.name,
                price: doc.price,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/"
                }
            });
        } else{
            res.status(404).json({
                message: 'No Valid Entry for Product ID'
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const key in req.body) {
        if (req.body.hasOwnProperty(key)) {
            updateOps[key] = req.body[key];
        }
    }
    Product.updateOne(
        {
            _id: id
        },
        {
            $set: updateOps
        }
    )
    .exec()
    .then(res.status(200).json({
            message: 'Updated product!',
            request: {
                type: 'GET',
                url: "http://localhost:3000/products/" + id
            }
        })
    )
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({
        _id: id
    })
    .exec()
    .then(res.status(200).json({
        message: 'Deleted Product!',
        request: {
            type: 'POST',
            url: "http://localhost:3000/products",
            body: { name: 'String', price: 'Number'}
            }
        })
    )
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;