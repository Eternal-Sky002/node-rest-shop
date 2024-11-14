const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Order.find()
    // memilih objek apa saja yang tampil
    .select("product quantity _id")
    // Untuk melihat isi dari product
    .populate('product', '_id name price')
    .exec()
    .then(docs => {
        const response = {
            // menambah objek count untuk melihat jumlah data
            count: docs.length,
            // menambah objek request per order agar bisa diarahkan ke request get by id
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/orders/" + doc._id
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
    // Cek apakah ada product dengan id yang sesuai
    Product.findById(req.body.productId)
    .then(product => {
        // Cek product ketika null akan 404 product not found
        if(!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity
        })
        return order.save();
    })
    .then(result => {
        res.status(201).json({
            message: 'Handling POST requests to /orders',
            createdOrders: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders/" + result._id
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

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
    // Untuk melihat isi product
    .populate('product', '_id name price')
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json({
                _id: doc.id,
                product: doc.product,
                quantity: doc.quantity,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders/"
                }
            });
        } else{
            res.status(404).json({
                message: 'No Valid Entry for Order ID'
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

router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    const updateOps = {};
    for (const key in req.body) {
        if (req.body.hasOwnProperty(key)) {
            updateOps[key] = req.body[key];
        }
    }
    Order.updateOne(
        {
            _id: id
        },
        {
            $set: updateOps
        }
    )
    .exec()
    .then(res.status(200).json({
            message: 'Updated order!',
            request: {
                type: 'GET',
                url: "http://localhost:3000/orders/" + id
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

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    Order.deleteOne({
        _id: id
    })
    .exec()
    .then(res.status(200).json({
        message: 'Deleted Order!',
        request: {
            type: 'POST',
            url: "http://localhost:3000/orders",
            body: { productId: 'ID', quantity: 'Number'}
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