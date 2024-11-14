const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/orders');

router.get('/', (req, res, next) => {
    Order.find()
    // memilih objek apa saja yang tampil
    .select("name price _id")
    .exec()
    .then(docs => {
        const response = {
            // menambah objek count untuk melihat jumlah data
            count: docs.length,
            // menambah objek request per order agar bisa diarahkan ke request get by id
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
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
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(201).json({
        message: 'Order was created',
        order: order
    });
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: 'Order details',
        orderId: id
    });
});

router.patch('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: 'Updated product!',
        id: id
    });
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;
    res.status(200).json({
        message: 'Order deleted',
        orderId: id
    });
});

module.exports = router;