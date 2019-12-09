var express = require('express');
var router = express.Router();
var tagService = require('../../services/users.service');


exports.addTag = function (req, res) {
    
    tagService.addTag(req.body)
        .then(function (data) {
            if (data) {
                res.send(data);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


exports.getAlltagdata = function (req, res) {

    tagService.getAlltagdata()
        .then(function (data) {
            if (data) {
                res.send(data);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });


}

exports.gettagdataId = function (req, res) {
 
    tagService.gettagdataId(req.params.tagId)
        .then(function (data) {
            if (data) {
                res.send(data);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

exports.updatingTagDataReview = function (req, res) {

    tagService.updatingTagDataReview(req.body)
        .then(function (data) {
            if (data) {
                res.send(data);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


exports.deletetag = function (req, res) {

   
    tagService.deletetag(req.params.tagid)
        .then(function () {
            res.json('success');
        })
        .catch(function (err) {
            res.status(400).send(err);
        });

}