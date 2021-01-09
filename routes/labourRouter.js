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
        // res.statusCode = 403;
        // res.end('POST  operation not supported on /laboures From here !');
        labours.create(req.body)
            .then((labour) => {
                console.log('labour  Created ', labour);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(labour);
            }, (err) => next(err))
            .catch((err) => next(err));
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
        labours.find({ labour_id: req.params.labourId })
            .then((labour) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');

                labour.forEach(element => {
                    res.json(element);
                });

            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        // res.statusCode = 403;
        // res.end('POST operation not supported on /labours/' + req.params.labourId);
        //console.log(req.body);
        //var query = { 'labour_id': req.params.labourId };
        
    })
    .put((req, res, next) => {
        var query = { 'labour_id': req.params.labourId };
        
        if (req.body.hrs_worked != undefined && req.body.labour_rate !== undefined){
            labours.findOneAndUpdate(query, {"profile_name":req.body.profile_name,"hrs_worked":req.body.hrs_worked,"labour_Type":req.body.labour_type,"labour_rate":req.body.labour_rate}, { upsert: true }, function (err, doc) {
                if (err) {console.log(err);return res.send(500, { error: err });}
                return res.send(200,{message:"Success"});
            });
        }
        

        if (req.body.TeamPart != undefined ){
            labours.findOneAndUpdate(query, {"TeamPart":req.body.TeamPart,"TeamDetails":req.body.TeamDetails}, { upsert: true }, function (err, doc) {
                if (err) {console.log(err);return res.send(500, { error: err });}
                return res.send('Succesfully saved.');
            });
        }
        if (req.body.comment != undefined ){
            labours.findById(req.params.labourId)
            .then((labour) => {
                if (labour != null) {
                    // console.log('req of user  id ',req.user._id);
                    // req.body.author = req.user._id;
                    console.log('req of body', req.body);
                    console.log('Labour is ', labour);

                     labour.Reviews.push(req.body);

                    labour.save()
                        .then((labour) => {

                            labour.update({"Rating":(req.body.rating+labour.Rating)/2}, { upsert: true }, function (err, doc) {
                                if (err) {console.log(err);return res.send(500, { error: err });}
                                return res.send('Succesfully saved.');
                            });
                                    // res.statusCode = 200;
                                    // res.setHeader('Content-Type', 'application/json');
                                    // res.json(labour);
                                
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Labour ID  ' + query + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
          
        }
        
        // labours.findByIdAndUpdate(req.params.labourId, {
        //     $set: req.body
        // }, { new: true })
        //     .then((labour) => {
        //         res.statusCode = 200;
        //         res.setHeader('Content-Type', 'application/json');
        //         res.json(labour);
        //     }, (err) => next(err))
        //     .catch((err) => next(err));
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