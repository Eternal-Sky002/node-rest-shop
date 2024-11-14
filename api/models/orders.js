const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    productId: {type: String, required: true},
    quantity: {type: Number, required: true}
});

module.exports = mongoose.model('Orders', orderSchema);