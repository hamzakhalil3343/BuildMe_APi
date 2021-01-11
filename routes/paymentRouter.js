var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

const payments = require('../models/paymentDetails');
router.use(bodyParser.json());

router.post('/', function(req, res, next) {
    payments.create(req.body)
    .then((payment) => {
        console.log('payment  Added ', payment);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(payment);
    }, (err) => next(err))
    .catch((err) => next(err));
});
router.get('/', function(req, res, next) {
    payments.find({})
    .then((payment) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(payment);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;
