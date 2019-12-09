var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var TagSchema = new Schema({

    qr_code: String,
    lastmodifiedby: String,
    product_name:String,
    userId: Number,
    product_type:String,
    sourcePortNo: String,
    destinationPortNo: String,
    dateadded: { type: Date, default: Date.now },
    datemodified: { type: Date },
    description:String,
    radius_curvature_a:String,
    apex_offset_a:String,
    fibre_height_a:String,
    apc_angle_a:String,
    key_error_a:String,
    radius_curvature_b:String,
    apex_offset_b:String,
    fibre_height_b:String,
    apc_angle_b:String,
    key_error_b:String,
    insertion_loss_a:String,
    insertion_loss_b:String,
    return_loss_a:String,
    return_loss_b:String,
    odfPortCount:Number,
    endAInstalledOnOdf:String,
    endBInstalledOnOdf:String,
    connectorType:Number
})
// set up a mongoose model

module.exports = mongoose.model('tagdata', TagSchema);