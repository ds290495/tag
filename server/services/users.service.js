var config = require('../config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var Users = require('../controllers/Users/users.model');// get our mongoose model
var tagData = require('../controllers/tag/tag.model');// get our mongoose model
var mongoose = require('mongoose');
// var db = mongo.db(config.connectionString, { native_parser: true });
var isodate = require("isodate");
// db.bind('users');
var dateFormat = require('dateformat');

var service = {};
service.authenticate = authenticate;
service.addTag = addTag;
service.updatetagData = updatetagData;
service.getqrcode = getqrcode;
service.getCableInfo = getCableInfo;
service.getAlltagdata = getAlltagdata;
service.gettagdataId = gettagdataId;
service.updatingTagDataReview = updatingTagDataReview;
service.deletetag = deletetag;

function authenticate(email, password) {
    var deferred = Q.defer();

    var query = { "email": email };

    Users.findOne(query, function (err, user) {

        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        }
        if (user && bcrypt.compareSync(password, user.password)) {

            deferred.resolve({
                _id: user._id,
                email: user.email,
                username: user.username,
                token: jwt.sign({ sub: user._id }, config.secret)
            });
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;

}

function addTag(data) {

    var deferred = Q.defer();
    var saveTags = new tagData({
        qr_code: data.qr_code,
        product_type: 'odf',
        product_name: data.product_name,
        sourcePortNo: [],
        destinationPortNo: [],
        userId: data.userId,
        dateadded: Date.now(),
        datemodified: Date.now(),
        odfPortCount: data.odfPortCount == "" ? 0 : data.odfPortCount,
        connectorType: data.connectorType
    });
    tagData.findOne({ "qr_code": data.qr_code }, function (err, tagResult) {

        if (err) {
            deferred.reject(err.name + ': ' + err.message);
        } else {
            if (tagResult) {
                var errorMsg = {}
                errorMsg.msg = 'Qr Code Already Exist!';
                deferred.resolve(errorMsg);
            } else {
                saveTags.save(function (err, saveTagsRes) {

                    if (!err) {
                        deferred.resolve(saveTagsRes);
                    } else {

                        deferred.reject(err.name + ': ' + err.message);
                    }

                });
            }
        }

    });
    return deferred.promise;
}





function updatetagData(postdata) {

    newdate = new Date();
    var deferred = Q.defer();

    tagData.findOne({ qr_code: postdata.qrCode, product_type: postdata.productType }, function (err, getdata) {
        if (!err) {
            if (getdata) {

                tagData.findOneAndUpdate({ _id: getdata._id },
                    {
                        lastmodifiedby: postdata.username,
                        datemodified: newdate.toISOString(),
                        product_name: postdata.productName,
                        sourcePortNo: postdata.productType == 'Cable' ? postdata.sourcePortNo : [],
                        destinationPortNo: postdata.productType == 'Cable' ? postdata.destinationPortNo : [],
                        endAInstalledOnOdf: postdata.productType == 'odf' ? postdata.endAInstalledOnOdf : [],
                        endBInstalledOnOdf: postdata.productType == 'odf' ? postdata.endBInstalledOnOdf : [],
                        odfPortCount: postdata.productType == 'odf' ? postdata.odfPortCount : 0,
                        userId: postdata.userId,
                        connectorType: postdata.productType == 'odf' ? postdata.connectorType : 0,
                        product_name: postdata.ProductName ? postdata.ProductName : getdata.product_name,
                    }, function (err, getdataagain) {
                        if (!err) {
                            if (getdataagain) {
                                var updateresponsedata =
                                {
                                    "responseCode": "0",
                                    "responseMsg": "success",
                                    "responseData":
                                        {}
                                }

                            } else {
                                var updateresponsedata = {
                                    "responseCode": "1",
                                    "responseMsg": "no data found",
                                    "responseData":
                                        {}
                                }

                            }

                            deferred.resolve(updateresponsedata);
                        } else {
                            deferred.reject(err.name + ': ' + err.message);
                        }
                    })
            } else {
                var updateresponsedata = {
                    "responseCode": "1",
                    "responseMsg": "no data found",
                    "responseData":
                        {}
                }
                deferred.resolve(updateresponsedata);
            }
        }
        else {
            deferred.reject(err.name + ': ' + err.message);
        }
    })

    return deferred.promise;
}



function getqrcode(qrdata) {

    var deferred = Q.defer();

    tagData.aggregate([
        {
            $match: {
                $and: [
                    { qr_code: qrdata.QRCode, product_type: qrdata.productType }
                ]
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "userId",
                as: "TagUserDetails"
            }
        }]).exec(function (err, getdata) {

            if (getdata[0]) {
                var mydate = !getdata[0].datemodified ? "" : dateFormat(getdata[0].datemodified, "yyyy-mm-dd'T'HH:MM:ss");
                var dataResponse = {
                    "responseCode": "0",
                    "responseMsg": "success",
                    "responseData":
                    {
                        "username": getdata[0].TagUserDetails[0].username,
                        "lastModifiedDate": mydate,
                        "sourcePortNo": getdata[0].sourcePortNo,
                        "destinationPortNo": getdata[0].destinationPortNo,
                        "productName": getdata[0].product_name,
                        "odfPortCount": getdata[0].odfPortCount,
                        "connectorType": getdata[0].connectorType,
                    }
                }
            } else {

                var dataResponse = {
                    "responseCode": "1",
                    "responseMsg": "no data found",
                    "responseData":
                    {
                        "username": '',
                        "lastModifiedDate": '',
                        "sourcePortNo": '',
                        "destinationPortNo": '',
                        "productName": '',
                        "odfPortCount": 0,
                        "connectorType": ""
                    }
                }

            }

            if (!err) {
                deferred.resolve(dataResponse);
            } else {
                deferred.reject(err.name + ': ' + err.message);
            }
        });


    return deferred.promise;
}
function getCableInfo(qrdata) {
    var deferred = Q.defer();

    tagData.aggregate([
        {
            $match: {
                $and: [
                    { qr_code: qrdata.QRCode }
                ]
            }
        }
    ]).exec(function (err, getdata) {
        if (getdata[0]) {

            var dataResponse = {
                "responseCode": "0",
                "responseMsg": "success",
                "responseData":
                {
                    "QRCode": getdata[0].qr_code,
                    "description": getdata[0].description,
                    "radius_curvature_a": getdata[0].radius_curvature_a.toString(),
                    "apex_offset_a": getdata[0].apex_offset_a.toString(),
                    "fibre_height_a": getdata[0].fibre_height_a.toString(),
                    "apc_angle_a": getdata[0].apc_angle_a.toString(),
                    "key_error_a": getdata[0].key_error_a.toString(),
                    "radius_curvature_b": getdata[0].radius_curvature_b.toString(),
                    "apex_offset_b": getdata[0].apex_offset_b.toString(),
                    "fibre_height_b": getdata[0].fibre_height_b.toString(),
                    "apc_angle_b": getdata[0].apc_angle_b.toString(),
                    "key_error_b": getdata[0].key_error_b.toString(),
                    "insertion_loss_a": getdata[0].insertion_loss_a.toString(),
                    "insertion_loss_b": getdata[0].insertion_loss_b.toString(),
                    "return_loss_a": getdata[0].return_loss_a.toString(),
                    "return_loss_b": getdata[0].return_loss_b.toString(),
                    "odfPortCount": getdata[0].odfPortCount,
                    'endAInstalledOnOdf': getdata[0].endAInstalledOnOdf,
                    'endBInstalledOnOdf': getdata[0].endBInstalledOnOdf
                }
            }
        } else {

            var dataResponse = {
                "responseCode": "1",
                "responseMsg": "no data found",
                "responseData":
                {
                    "QRCode": "",
                    "description": "",
                    "radius_curvature_a": "",
                    "apex_offset_a": "",
                    "fibre_height_a": "",
                    "apc_angle_a": "",
                    "key_error_a": "",
                    "radius_curvature_b": "",
                    "apex_offset_b": "",
                    "fibre_height_b": "",
                    "apc_angle_b": "",
                    "key_error_b": "",
                    "insertion_loss_a": "",
                    "insertion_loss_b": "",
                    "return_loss_a": "",
                    "return_loss_b": "",
                    "odfPortCount": "",
                    'endAInstalledOnOdf': "",
                    'endBInstalledOnOdf': "",
                }
            }

        }

        if (!err) {
            deferred.resolve(dataResponse);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    });


    return deferred.promise;
}

function getAlltagdata() {
    var deferred = Q.defer();
    tagData.aggregate([

        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "userId",
                as: "TagUserDetails"
            }
        }]).exec(function (err, getdata) {
            if (!err) {
                deferred.resolve(getdata);
            } else {
                deferred.reject(err.name + ': ' + err.message);
            }
        })
    return deferred.promise;

}


function gettagdataId(tagId) {

    var deferred = Q.defer();
    var tagId = new mongoose.Types.ObjectId(tagId);
    tagData.aggregate([
        {
            $match: {
                $and: [
                    { _id: tagId }
                ]
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "userId",
                as: "TagUserDetails"
            }
        }]).exec(function (err, getdata) {
            if (!err) {
                deferred.resolve(getdata);
            } else {
                deferred.reject(err.name + ': ' + err.message);
            }
        })
    return deferred.promise;

}



function updatingTagDataReview(tagdata) {

    var deferred = Q.defer();
    tagData.findById(tagdata._id, function (err, getdata) {
        if (!err) {
            getdata.qr_code = tagdata.qr_code;
            getdata.product_name = tagdata.product_name;
            getdata.panelPortCount = tagdata.product_type == 'Panel' ? tagdata.TagNo : [];
            getdata.panelCount = tagdata.product_type == 'Cabinet' ? tagdata.TagNo : [];
            getdata.sourcePortNo = tagdata.product_type == 'Cable' ? tagdata.sourceNo : [];
            getdata.destinationPortNo = tagdata.product_type == 'Cable' ? tagdata.destinationNo : [];
            getdata.cabinet_name = tagdata.product_type == 'Panel' ? tagdata.cabinet_name : [];
            getdata.datemodified = Date.now();
            getdata.userId = tagdata.userId
            getdata.save(function (err) {
                if (!err) {
                    deferred.resolve(getdata);
                } else {
                    deferred.reject(err.name + ': ' + err.message);
                }
            });

        } else {
            deferred.reject(err.name + ': ' + err.message);
        }

    });

    return deferred.promise;
}


function deletetag(tagid) {

    var deferred = Q.defer();


    tagData.deleteOne(
        { _id: new mongoose.Types.ObjectId(tagid) },
        function (err) {
            if (err) {
                console.log(err);
                deferred.reject(err.name + ': ' + err.message);
            }
            else {
                deferred.resolve();
            }

        });
    return deferred.promise;

}



module.exports = service;
