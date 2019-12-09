var config = require('../config.json');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var Training = require('../controllers/Training/training.model');
var TrainingLineItem = require('../controllers/trainingitem/trainingitem.model');
var mongoose = require('mongoose');

var service = {};
service.getAllProduct = getAllProduct;
service.getProductbyId = getProductbyId;
service.deleteitem = deleteitem;
service.updateProduct = updateProduct;
service.updatestatus = updatestatus;
service.getTrainingbyId = getTrainingbyId;
service.removeTrainingItems = removeTrainingItems;
service.getTrainingItems = getTrainingItems;
service.getTrainingbyProductId = getTrainingbyProductId;
service.exportTrainingItems = exportTrainingItems;
service.reOrderItems = reOrderItems;
service.deleteTrainingProgram = deleteTrainingProgram;
service.reOrderLineItems = reOrderLineItems;


function getAllProduct() {

    var deferred = Q.defer();
    Training.find(function (err, getData) {

        if (!err) {
            deferred.resolve(getData);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    })
    return deferred.promise;

}

function getProductbyId(productId) {
    var deferred = Q.defer();
    var ProductId = new mongoose.Types.ObjectId(productId);

    Training.findOne(ProductId, function (err, product) {
        if (!err) {
            TrainingLineItem.find({ "productId":ProductId } , function (err, lineitem) {
                if (!err) {
                    
                    deferred.resolve({'product':product,'lineitem':lineitem});
                } else {
                    deferred.reject(err.name + ': ' + err.message);
                }
            }).sort({ order: 1 });
            
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    });
    return deferred.promise;

}

function getTrainingbyId(itemid) {
    var deferred = Q.defer();
    var itemId = new mongoose.Types.ObjectId(itemid);

    
        TrainingLineItem.findOne(itemId, function (err, lineitem) {
            if (!err) {
                
                deferred.resolve(lineitem);
            } else {
                deferred.reject(err.name + ': ' + err.message);
            }
        });
            
        
   
    return deferred.promise;

}

function deleteitem(itemid, productid,ordervalue) {


    var itemid = new mongoose.Types.ObjectId(itemid);
    var deferred = Q.defer();
    
    TrainingLineItem.deleteOne(
        { _id: itemid },
        function (err) {
            if (err) {
                console.log(err);
                deferred.reject(err.name + ': ' + err.message);

                
            }
            else {
                var data = {};
                data.string = 'Training line item deleted successfully';
                var query = {"order": { $gt: parseInt(ordervalue) } };
                var data =  {$inc: { order: -1 }};

                TrainingLineItem.updateMany(query ,data,
                  function (err, lineitemdata) {
                  if (!err) {
                    deferred.resolve();
                    
                  } else {
                    deferred.reject(err.name + ': ' + err.message);
                  }
                });
                
            }
        });
    return deferred.promise;

}

function updateProduct(productdata)
{
    var deferred = Q.defer();

    Training.find({ $and: [{ productCode: productdata.productCode }, { _id: { $ne: productdata._id } }] }, function (err, productscheck) {
        
        if (!err) {
            if (productscheck.length > 0) {
                var data = {};
                data.string = 'Item code is already exist, Please enter another code!';
                deferred.resolve(data);
            }
            else
            {
                 Training.findById(productdata._id, function (error, products) {
                if (!error) {

                    products.productCode = productdata.productCode;
                    products.procutName = productdata.productName;
                    products.datemodified = Date.now();

                    products.save(function (error) {
                        if (!error) {
                            deferred.resolve(products);
                        } else {
                            deferred.reject(error.name + ': ' + error.message);
                        }
                    });

                } else {
                    deferred.reject(error.name + ': ' + error.message);
                }
            });
            }
            

        } else {
            console.log(err);
            deferred.reject(err.name + ': ' + err.message);
        }
    });
    return deferred.promise;
}

function updatestatus(updatedata)
{
    var deferred = Q.defer();
    var itemid = new mongoose.Types.ObjectId(updatedata.itemid);

    TrainingLineItem.findById(itemid, function (err, lineitem) {
        if (!err) {
            lineitem.status = updatedata.status;
            lineitem.date_modified = Date.now();

            lineitem.save(function (err) {
                if (!err) {
                    deferred.resolve(lineitem);

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

function removeTrainingItems(lineitemid, trainingid,ordervalue) {
    var lineitem_id = new mongoose.Types.ObjectId(lineitemid);
    var training_id = new mongoose.Types.ObjectId(trainingid);
    var deferred = Q.defer();
    
    TrainingLineItem.update(
        { _id: training_id },
        { $pull: { traininglineitem: { _id: lineitem_id } } },
        function (err,linelineitemdata) {
            if (err) {
                console.log(err);
                deferred.reject(err.name + ': ' + err.message);
            }
            else {
                var data = {};
                data.string = 'Training line item deleted successfully';
                
                TrainingLineItem.findOne({ _id: training_id}, 
                    function (err, lineitemdata) {
                        if (!err) {
                         for(let i=0; i<lineitemdata.traininglineitem.length;i++)
                        {
                            if(lineitemdata.traininglineitem[i].order>parseInt(ordervalue))
                            {
                                var query = {_id: training_id , "traininglineitem._id": new mongoose.Types.ObjectId(lineitemdata.traininglineitem[i]._id)};
                                var data =  {$inc: { 'traininglineitem.$.order': -1 }};
                
                                TrainingLineItem.updateMany( query ,data,
                                function (err, linedata) {
                                    if (!err) {
                                        deferred.resolve();
                                    } else {
                                    deferred.reject(err.name + ': ' + err.message);
                                    }
                                });
                            }
                        }
                        //deferred.resolve();
                        
                        } else {
                        deferred.reject(err.name + ': ' + err.message);
                        }
                    });
                deferred.resolve();
            }
        });
    return deferred.promise;

}

function getTrainingItems() {

    var deferred = Q.defer();
    TrainingLineItem.find(function (err, getData) {

        if (!err) {
            deferred.resolve(getData);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    })
    return deferred.promise;

}

function getTrainingbyProductId(productId) {
    var deferred = Q.defer();
    var ProductId = new mongoose.Types.ObjectId(productId);

    TrainingLineItem.find({ "productId":ProductId } , function (err, lineitem) {
        if (!err) {
            
            deferred.resolve(lineitem);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    });
            
    return deferred.promise;
}

function exportTrainingItems(productId) {
    var deferred = Q.defer();
    var ProductId = new mongoose.Types.ObjectId(productId);

    TrainingLineItem.find({ "productId":ProductId } , function (err, lineitem) {
        if (!err) {
            
            deferred.resolve(lineitem);
        } else {
            deferred.reject(err.name + ': ' + err.message);
        }
    }).sort({ order: 1 });
    return deferred.promise;

}

function reOrderItems(orderdata)
{
    var deferred = Q.defer();
    var oldindex =orderdata.previousIndex+1;
    var newindex =orderdata.currentIndex+1;
    
    if(oldindex < newindex)
    {
        var myquery = { "order": oldindex };
        var newvalues = { $set: {"order": newindex } };

        TrainingLineItem.findOneAndUpdate(myquery, newvalues,
        
         function (err, lineitem) {
            if (!err) {
                var query = {"order": {$gt:oldindex, $lte: newindex }, "_id": { $ne: new mongoose.Types.ObjectId(lineitem._id) }  };
                var data =  {$inc: { "order": -1 }};

                TrainingLineItem.updateMany(query ,data,
                  function (err, lineitemdata) {
                  if (!err) {
                    deferred.resolve();
                  } else {
                    deferred.reject(err.name + ': ' + err.message);
                  }
                });
                deferred.resolve(lineitem);
            } else {
                deferred.reject(err.name + ': ' + err.message);
            }
        });
    }
    else if(oldindex > newindex)
    {
        var myquery = { "order": oldindex };
        var newvalues = { $set: {"order": newindex } };

        TrainingLineItem.findOneAndUpdate(myquery, newvalues,
            function (err, lineitem) {
            if (!err) {
                
                var query = {"order": {$gte:newindex, $lt: oldindex }, "_id": { $ne: new mongoose.Types.ObjectId(lineitem._id) }  };
                var data =  {$inc: { "order": 1 }};

                TrainingLineItem.updateMany(query ,data,
                  function (err, lineitemdata) {
                  if (!err) {
                    deferred.resolve();
                    
                  } else {
                    deferred.reject(err.name + ': ' + err.message);
                  }
                });
                deferred.resolve(lineitem);
            } else {

                
                deferred.reject(err.name + ': ' + err.message);
            }
        });
    }
    return deferred.promise;
}

function deleteTrainingProgram(productid) {

    var deferred = Q.defer();
    Training.deleteOne(
        { _id: new mongoose.Types.ObjectId(productid) },
        function (err) {
            if (err) {
                console.log(err);
                deferred.reject(err.name + ': ' + err.message);
            }
            else {
                TrainingLineItem.deleteOne(
                    { productId: new mongoose.Types.ObjectId(productid) },
                    function (err) {
                        if (err) {
                            console.log(err);
                            deferred.reject(err.name + ': ' + err.message);
                        }
                        else {
                            deferred.resolve();
                        }
                    });
                deferred.resolve();
            }
        });
    return deferred.promise;

}


function reOrderLineItems(itemdata)
{
    var deferred = Q.defer();
    var oldindex =itemdata.previousIndex+1;
    var newindex =itemdata.currentIndex+1;
    
    if(oldindex < newindex)
    {
        var myquery = {  _id :  new mongoose.Types.ObjectId(itemdata.itemid) ,
                //'traininglineitem.order':oldindex
            };
        var newvalues = { $set: {"traininglineitem.order": newindex } };

        TrainingLineItem.findOne(myquery,
        
         function (err, lineitem) {
            if (!err) {
                
                //deferred.resolve(lineitem);
                for(let i=0; i<lineitem.traininglineitem.length;i++)
                {
                    if(lineitem.traininglineitem[i].order==oldindex)
                    {
                        var lineid =lineitem.traininglineitem[i]._id;
                        var queryone = {_id: new mongoose.Types.ObjectId(itemdata.itemid) , "traininglineitem.order": oldindex};
                         var dataone =  {$set: {"traininglineitem.$.order": newindex }};
                            
                           
                        TrainingLineItem.updateOne( queryone ,dataone,
                        function (err, linedata) {
                            if (!err) {
                                
                            } else {
                            //deferred.reject(err.name + ': ' + err.message);
                            }
                        });
                    }
                   
                    
                    // else
                    // {
                    //         var querymany = {_id: new mongoose.Types.ObjectId(itemdata.itemid) , "traininglineitem.order": {$gt:oldindex, $lte: newindex }};
                    //         var datamany =  {$inc: { 'traininglineitem.$.order': -1 }};
                            
                    //         TrainingLineItem.updateMany( querymany ,datamany,
                    //         function (err, linedata) {
                    //             if (!err) {
                    //                 deferred.resolve();
                    //             } else {
                    //             deferred.reject(err.name + ': ' + err.message);
                    //             }
                    //         });
                    // }
                    

                    // if(lineitemdata.traininglineitem[i].order>parseInt(ordervalue))
                    // {
                    //     var query = {_id: training_id , "traininglineitem._id": new mongoose.Types.ObjectId(lineitemdata.traininglineitem[i]._id)};
                    //     var data =  {$inc: { 'traininglineitem.$.order': -1 }};

                    //     TrainingLineItem.updateMany( query ,data,
                    //     function (err, linedata) {
                    //         if (!err) {
                    //             deferred.resolve();
                    //         } else {
                    //         deferred.reject(err.name + ': ' + err.message);
                    //         }
                    //     });
                    // }
                }
                
                var querymany = {_id: new mongoose.Types.ObjectId(itemdata.itemid) , "traininglineitem.order":{$gt:oldindex, $lte: newindex }
                };
               
                var datamany =  {$inc: { 'traininglineitem.$.order': -1 }};
                var dataone =  {$set: {"traininglineitem.$.order": 51 }};
                //var data =  {$inc: { "order": -1 }};
                
                TrainingLineItem.updateMany( querymany ,dataone,
                function (err, linedata) {
                    if (!err) {
                        //console.log('done');
                        // deferred.resolve();
                    } else {
                    //deferred.reject(err.name + ': ' + err.message);
                    }
                });
            } else {
                console.log('err');
                console.log(err);
                deferred.reject(err.name + ': ' + err.message);
            }
        });
    }
    else if(oldindex > newindex)
    {
        var myquery = { "order": oldindex };
        var newvalues = { $set: {"order": newindex } };

        TrainingLineItem.findOneAndUpdate(myquery, newvalues,
            function (err, lineitem) {
            if (!err) {
                
                var query = {"order": {$gte:newindex, $lt: oldindex }, "_id": { $ne: new mongoose.Types.ObjectId(lineitem._id) }  };
                var data =  {$inc: { "order": 1 }};

                TrainingLineItem.updateMany(query ,data,
                  function (err, lineitemdata) {
                  if (!err) {
                    deferred.resolve();
                    
                  } else {
                    deferred.reject(err.name + ': ' + err.message);
                  }
                });
                deferred.resolve(lineitem);
            } else {

                
                deferred.reject(err.name + ': ' + err.message);
            }
        });
    }
    return deferred.promise;
}

module.exports = service;