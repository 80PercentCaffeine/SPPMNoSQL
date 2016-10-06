var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var salesSchema = mongoose.Schema({
   id: { type: String, required: true },
   // list of item ids
   items: [String],
   total: Number,
   totalprofit: Number,
   timestamp: Number
})
module.exports = mongoose.model('Sales', salesSchema);
