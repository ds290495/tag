var express = require('express');

var trainingService = require('../../services/training.service');



exports.updateProduct = function (req, res) {
    trainingService.updateProduct(req.body)
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

