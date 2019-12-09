var express = require('express');
var router = express.Router();
var userService = require('../../services/users.service');

router.post('/authenticate', authenticate);
router.post('/getqrcode', getqrcode);
router.post('/getCableInfo', getCableInfo);
router.post('/updatetagData', updatetagData);

module.exports = router;

function authenticate(req, res) {

    userService.authenticate(req.body.email, req.body.password, req.body.flag)
        .then(function (user) {
         
            if (user) {

                if (!req.body.flag) {
                    var data = {
                        "responseCode": "0",
                        "responseMsg": "Login Successful",
                        "responseData": {
                            "userId": user.userId,
                            "email": user.email,
                            "username": user.username

                        }
                    }


                    res.send(data);
                } else {
                    res.send(user);
                }
            } else {
                if (!req.body.flag) {
                    var dataAgain = {
                        "responseCode": "1",
                        "responseMsg": "Username or password is incorrect",
                        "responseData": {

                        }
                    }
                    res.send(dataAgain);
                } else {
                    // authentication failed
                    res.status(400).send('Username or password is incorrect');
                }
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function getqrcode(req, res) {
 
    userService.getqrcode(req.body).then(function (data) {
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


function getCableInfo(req, res) {
 
    userService.getCableInfo(req.body).then(function (data) {
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



function updatetagData(req, res) {

    userService.updatetagData(req.body).then(function (data) {
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

