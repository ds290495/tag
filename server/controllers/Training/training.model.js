var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ProductSchema = new Schema({
    productCode: String,
    procutName: String,
   
    dateadded: { type: Date, default: Date.now },
    datemodified: { type: Date, default: Date.now }
})
module.exports = mongoose.model('products', ProductSchema);