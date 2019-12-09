var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var traininglineitemSchema = new Schema({
    productId: ObjectId,
    title: String,
    image: String,
    vimeolink: String,
    status: Boolean,
    order: Number,
    filetype: { type: String },
    traininglineitem: [{
        name: { type: String },
        image: { type: String },
        gifurl: { type: String },
        filetype: { type: String },
        order: { type: Number },
    }],
    dateadded: { type: Date, default: Date.now },
    datemodified: { type: Date, default: Date.now }

})
module.exports = mongoose.model('traininglineitem', traininglineitemSchema);