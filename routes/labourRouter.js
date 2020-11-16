const express = require('express');
const bodyParser = require('body-parser');

const labourRouter = express.Router();
const labours = require('../models/labour');
labourRouter.use(bodyParser.json());
//Route of the labours
labourRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        labours.find({})
            .then((labours) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(labours);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST  operation not supported on /laboures From here !');
        // labours.create(req.body)
        //     .then((labour) => {
        //         console.log('labour  Created ', labour);
        //         res.statusCode = 200;
        //         res.setHeader('Content-Type', 'application/json');
        //         res.json(labour);
        //     }, (err) => next(err))
        //     .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /laboures');
    })
    .delete((req, res, next) => {
        labours.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });
//Route to labour ID 
labourRouter.route('/:labourId')
    .get((req, res, next) => {
        labours.findById(req.params.labourId)
            .then((labour) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(labour);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /labours/' + req.params.labourId);
    })
    .put((req, res, next) => {
        labours.findByIdAndUpdate(req.params.labourId, {
            $set: req.body
        }, { new: true })
            .then((labour) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(labour);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        labours.findByIdAndRemove(req.params.labourId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

    module.exports = labourRouter;