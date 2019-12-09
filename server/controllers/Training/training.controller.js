var express = require('express');

var trainingService = require('../../services/training.service');



exports.getAllProduct = function (req, res) {

    trainingService.getAllProduct()

        .then(function (user) {
            if (user) {

                res.send(user);
            } else {
                res.status(400).send('No Data Found');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
exports.getProductbyId = function (req , res) {
 
    trainingService.getProductbyId(req.params.productId)
    .then(function (product) {
        if (product) {
            res.send(product);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}

exports.deleteitem = function (req , res) {
    
    trainingService.deleteitem(req.params.itemid,req.params.productid,req.params.order)
    .then(function () {
        res.json('data');
    })
    .catch(function (err) {
        res.status(400).send(err);
    });

}

exports.updatestatus = function (req , res) {
  
    trainingService.updatestatus(req.body)
   .then(function (lineitem) {
       
       if (lineitem) {
           res.send(lineitem);
       } else {
           res.sendStatus(404);
       }
   })
   .catch(function (err) {
       res.status(400).send(err);
   });   

}

exports.getTrainingbyId = function (req , res) {
 
    trainingService.getTrainingbyId(req.params.itemid)
    .then(function (trainingitems) {
        if (trainingitems) {
            res.send(trainingitems);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}

exports.removeTrainingItems = function (req , res) {
   trainingService.removeTrainingItems(req.params.lineitemid,req.params.trainingid,req.params.ordervalue)
    .then(function () {
        res.json('data');
    })
    .catch(function (err) {
        res.status(400).send(err);
    });

}

exports.getTrainingItems = function (req, res) {

    trainingService.getTrainingItems()

        .then(function (user) {
            if (user) {

                res.send(user);
            } else {
                res.status(400).send('No Data Found');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

exports.getTrainingbyProductId = function (req , res) {
 
    trainingService.getTrainingbyProductId(req.params.productId)
    .then(function (product) {
        if (product) {
            res.send(product);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}
exports.exportTrainingItems = function (req , res) {
 
    trainingService.exportTrainingItems(req.params.productId)
    .then(function (product) {
        if (product) {
            res.send(product);
        } else {
            res.sendStatus(404);
        }
    })
    .catch(function (err) {
        res.status(400).send(err);
    });
}

exports.reOrderItems = function (req , res) {
  
    trainingService.reOrderItems(req.body)
   .then(function (lineitem) {
       
       if (lineitem) {
           res.send(lineitem);
       } else {
           res.sendStatus(404);
       }
   })
   .catch(function (err) {
       res.status(400).send(err);
   });   

}

exports.deleteTrainingProgram = function (req, res) {

    trainingService.deleteTrainingProgram(req.params.productid)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });

}

exports.reOrderLineItems = function (req , res) {
    trainingService.reOrderLineItems(req.body)
   .then(function (lineitem) {
       
       if (lineitem) {
           res.send(lineitem);
       } else {
           res.sendStatus(404);
       }
   })
   .catch(function (err) {
       res.status(400).send(err);
   });   

}




