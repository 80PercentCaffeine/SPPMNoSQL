var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
    id: { type: String, required: true },
    name: String,
    description: String,
    // stored in cents. eg, $19.98 would be 1998
    price: Number,
    // stored in cents. eg, $19.98 would be 1998
    costprice: Number,
    stock: Number
})
console.log("Inside item.model");
module.exports = mongoose.model('Item', itemSchema);
