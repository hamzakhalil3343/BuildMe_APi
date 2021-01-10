const express = require('express');
const bodyParser = require('body-parser');

const contractorRouter = express.Router();
const contractors = require('../models/contractor');
contractorRouter.use(bodyParser.json());
//Route of the contractors
contractorRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        contractors.find({})
            .then((contractors) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(contractors);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
         res.statusCode = 403;
         res.end('POST  operation not supported on /contractors From here !');
        // contractors.create(req.body)
        //     .then((contractor) => {
        //         console.log('contractor  Created ', contractor);
        //         res.statusCode = 200;
        //         res.setHeader('Content-Type', 'application/json');
        //         res.json(contractor);
        //     }, (err) => next(err))
        //     .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /contractors');
    })
    .delete((req, res, next) => {
        contractors.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });
//Route to contractor ID 
contractorRouter.route('/:contractorId')
    .get((req, res, next) => {
        contractors.find({ contractor_id: req.params.contractorId })
            .then((contractor) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');

                contractor.forEach(element => {
                    res.json(element);
                });

            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        contractors.findByIdAndUpdate(req.params.contractorId, {
            isAuthenticated: req.body.isAuthenticated
        }, { new: true })
            .then((contractor) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(contractor);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        var query = { 'contractor_id': req.params.contractorId };
        
        if (req.body.contractor_Type != undefined ){
            contractors.findOneAndUpdate(query, {"hrs_worked":req.body.hrs_worked,"contractor_Type":req.body.contractor_type,"contractor_rate":req.body.contractor_rate,TeamPart:req.body.TeamPart}, { upsert: true }, function (err, doc) {
                if (err) {console.log(err);return res.send(500, { error: err });}
                return res.send('Succesfully saved.');
            });
        }
        if (req.body.isAuthenticated != undefined ){
            contractors.findOneAndUpdate(query, {"isAuthenticated":req.body.isAuthenticated}, { upsert: true }, function (err, doc) {
                if (err) {console.log(err);return res.send(500, { error: err });}
                return res.send('Succesfully saved.');
            });
        }
       


        // contractors.findByIdAndUpdate(req.params.contractorId, {
        //     $set: req.body
        // }, { new: true })
        //     .then((contractor) => {
        //         res.statusCode = 200;
        //         res.setHeader('Content-Type', 'application/json');
        //         res.json(contractor);
        //     }, (err) => next(err))
        //     .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        contractors.findByIdAndRemove(req.params.contractorId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });
    contractorRouter.route('Admin/:Id')
    .put((req, res, next) => {
        contractors.findByIdAndUpdate(req.params.Id, {
            isAuthenticated: req.body.isAuthenticated
        }, { new: true })
            .then((contractor) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(contractor);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

module.exports = contractorRouter;