var express = require('express');
var router = express.Router();

// Require controller modules.
var tageddata = require('./controllers/tag/tag.controller');

router.post('/users/addTag', tageddata.addTag);
router.get('/users/getAlltagdata', tageddata.getAlltagdata);
router.get('/users/gettagdataId/:tagId', tageddata.gettagdataId);
router.post('/users/updatingTagDataReview', tageddata.updatingTagDataReview);
router.delete('/users/deletetag/:tagid', tageddata.deletetag);

var training = require('./controllers/Training/training.controller');
router.get('/training/getAllProduct', training.getAllProduct);
router.get('/training/getTrainingItems', training.getTrainingItems);
router.get('/training/getProductbyId/:productId', training.getProductbyId);
router.get('/training/deleteitem/:itemid/:productid/:order', training.deleteitem);
router.post('/training/updatestatus', training.updatestatus);
router.get('/training/getTrainingbyId/:itemid', training.getTrainingbyId);
router.get('/training/removeTrainingItems/:lineitemid/:trainingid/:ordervalue', training.removeTrainingItems);
router.get('/training/getTrainingbyProductId/:productId', training.getTrainingbyProductId);
router.get('/training/exportTrainingItems/:productId', training.exportTrainingItems);
router.post('/training/reOrderItems', training.reOrderItems);
router.delete('/training/deleteTrainingProgram/:productid', training.deleteTrainingProgram);
router.post('/training/reOrderLineItems', training.reOrderLineItems);


var product = require('./controllers/Products/product.controller');
router.post('/products/updateProduct', product.updateProduct);

module.exports = router;