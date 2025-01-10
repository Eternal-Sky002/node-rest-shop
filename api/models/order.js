const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    quantity: {type: Number, default: 1},
    totalPrice: {type: Number}
});

module.exports = mongoose.model('Orders', orderSchema);