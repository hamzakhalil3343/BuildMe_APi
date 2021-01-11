var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

const reviews = require('../models/Review');
router.use(bodyParser.json());

router.post('/', function(req, res, next) {
    reviews.create(req.body)
    .then((review) => {
        console.log('Review  Added ', review);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(review);
    }, (err) => next(err))
    .catch((err) => next(err));
});
router.get('/', function(req, res, next) {
    reviews.find({})
    .then((review) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(review);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;
