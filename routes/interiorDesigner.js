const express = require('express');
const bodyParser = require('body-parser');

const interiorDesignerRouter = express.Router();
const interiorDesigners = require('../models/interiorDesigner');
interiorDesignerRouter.use(bodyParser.json());
//Route of the interiorDesigners
interiorDesignerRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        interiorDesigners.find({})
            .then((interiorDesigners) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(interiorDesigners);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        // res.statusCode = 403;
        // res.end('POST  operation not supported on /interiorDesigner From here !');
        interiorDesigners.create(req.body)
            .then((interiorDesigner) => {
                console.log('interiorDesigner  Created ', interiorDesigner);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(interiorDesigner);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /interiorDesigner');
    })
    .delete((req, res, next) => {
        interiorDesigners.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });
//Route to interiorDesigner ID 
interiorDesignerRouter.route('/:interiorDesignerId')
    .get((req, res, next) => {
        interiorDesigners.find({ interiorDesigner_id: req.params.interiorDesignerId })
            .then((interiorDesigner) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');

                interiorDesigner.forEach(element => {
                    res.json(element);
                });

            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /interiorDesigners/' + req.params.interiorDesignerId);
    })
    .put((req, res, next) => {
        var query = { 'interiorDesigner_id': req.params.interiorDesignerId };
        
        if (req.body.profile_name != undefined ){
            interiorDesigners.findOneAndUpdate(query, {"profile_name":req.body.profile_name,"hrs_worked":req.body.hrs_worked,"interiorDesigner_Type":req.body.interiorDesigner_type,"interiorDesigner_rate":req.body.interiorDesigner_rate}, { upsert: true }, function (err, doc) {
                if (err) {console.log(err);return res.send(500, { error: err });}
                return res.send('Succesfully .');
            });
        }
        

        if (req.body.TeamPart != undefined ){
            interiorDesigners.findOneAndUpdate(query, {"TeamPart":req.body.TeamPart,"TeamDetails":req.body.TeamDetails}, { upsert: true }, function (err, doc) {
                if (err) {console.log(err);return res.send(500, { error: err });}
                return res.send('Succesfully saved.');
            });
        }
        if (req.body.comment != undefined ){
            interiorDesigners.findById(req.params.interiorDesignerId)
            .then((interiorDesigner) => {
                if (interiorDesigner != null) {
                    // console.log('req of user  id ',req.user._id);
                    // req.body.author = req.user._id;
                    console.log('req of body', req.body);
                    console.log('interiorDesigner is ', interiorDesigner);

                     interiorDesigner.Reviews.push(req.body);

                    interiorDesigner.save()
                        .then((interiorDesigner) => {

                            interiorDesigner.update({"Rating":(req.body.rating+interiorDesigner.Rating)/2}, { upsert: true }, function (err, doc) {
                                if (err) {console.log(err);return res.send(500, { error: err });}
                                return res.send('Succesfully saved.');
                            });
                                    // res.statusCode = 200;
                                    // res.setHeader('Content-Type', 'application/json');
                                    // res.json(interiorDesigner);
                                
                        }, (err) => next(err));
                }
                else {
                    err = new Error('interiorDesigner ID  ' + query + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
          
        }
        
        // interiorDesigners.findByIdAndUpdate(req.params.interiorDesignerId, {
        //     $set: req.body
        // }, { new: true })
        //     .then((interiorDesigner) => {
        //         res.statusCode = 200;
        //         res.setHeader('Content-Type', 'application/json');
        //         res.json(interiorDesigner);
        //     }, (err) => next(err))
        //     .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        interiorDesigners.findByIdAndRemove(req.params.interiorDesignerId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });
    //Route to contract 
    interiorDesignerRouter.route('/:interiorDesignerId/contract')
        .get((req, res, next) => {
            interiorDesigners.findById(req.params.interiorDesignerId)
                .then((interiorDesigner) => {
                    if (interiorDesigner != null) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(interiorDesigner.contract);
                    }
                    else {
                        err = new Error('interiorDesigner ' + req.params.interiorDesignerId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                .catch((err) => next(err));
        })
        .post((req, res, next) => {
            // var query = { 'interiorDesigner_id': req.params.interiorDesignerId };
        

            // interiorDesigners.findOneAndUpdate(query, "contracts":[{"name":req.body.name,"details":req.body.details}], { upsert: true }, function (err, doc) {
            //     if (err) {console.log(err);return res.send(500, { error: err });}
            //     return res.send('Succesfully saved.');
            // });
            interiorDesigners.findById(req.params.interiorDesignerId)
                .then((interiorDesigner) => {
                    if (interiorDesigner != null) {
                        // console.log('req of user  id ',req.user._id);
                        // req.body.author = req.user._id;
                        console.log('req of body', req.body);
                     
                        interiorDesigner.contracts.push({"name":req.body.name,"details":req.body.details,"additionalDetails":req.body.additionalDetails});
    
                        interiorDesigner.save()
                            .then((interiorDesigner) => {
                                interiorDesigners.findById(interiorDesigner._id)
    
                                    .then((interiorDesigner) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(interiorDesigner);
                                    })
                            }, (err) => next(err));
                    }
                    else {
                        err = new Error('interiorDesigner ' + req.params.interiorDesignerId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                .catch((err) => next(err));
        })
        .put((req, res, next) => {
            res.statusCode = 403;
            res.end('PUT operation not supported on /interiorDesigneres/'
                + req.params.interiorDesignerId + '/contract');
        })
        .delete((req, res, next) => {
            interiorDesigners.findById(req.params.interiorDesignerId)
                .then((interiorDesigner) => {
                    if (interiorDesigner != null) {
                        for (var i = (interiorDesigner.contract.length - 1); i >= 0; i--) {
                            interiorDesigner.contract.id(interiorDesigner.contract[i]._id).remove();
                        }
                        interiorDesigner.save()
                            .then((interiorDesigner) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(interiorDesigner);
                            }, (err) => next(err));
                    }
                    else {
                        err = new Error('interiorDesigner ' + req.params.interiorDesignerId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                .catch((err) => next(err));
        });
    
    
    //Route of  contract by ID 
    
    
    interiorDesignerRouter.route('/:interiorDesignerId/contract/:contractId')
        .get((req, res, next) => {
            interiorDesigners.findById(req.params.interiorDesignerId)
                .then((interiorDesigner) => {
                    if (interiorDesigner != null && interiorDesigner.contract.id(req.params.contractId) != null) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(interiorDesigner.contract.id(req.params.contractId));
                    }
                    else if (interiorDesigner == null) {
                        err = new Error('interiorDesigner ' + req.params.interiorDesignerId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                    else {
                        err = new Error('contract ' + req.params.contractId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                .catch((err) => next(err));
        })
        .post((req, res, next) => {
            res.statusCode = 403;
            res.end('POST operation not supported on /interiorDesigners/' + req.params.interiorDesignerId
                + '/contract/' + req.params.contractId);
        })
        .put((req, res, next) => {
            interiorDesigners.findById(req.params.interiorDesignerId)
                .then((interiorDesigner) => {
                    if (interiorDesigner != null && interiorDesigner.contract.id(req.params.contractId) != null) {
                        // check if the user updating the contract is the same one who posted it
                        // in the first place
                        var req_contract_id = interiorDesigner.contract.id(req.params.contractId);
                        if (req_contract_id) {
                            if (req.body.price) {
                                interiorDesigner.contract.id(req.params.contractId).price = req.body.price;
                            }
                            if (req.body.quantitie) {
                                interiorDesigner.contract.id(req.params.contractId).quantitie = req.body.quantitie;
                            }
                            if (req.body.name) {
                                interiorDesigner.contract.id(req.params.contractId).name = req.body.name;
                            }
                            if (req.body.contract_type) {
                                interiorDesigner.contract.id(req.params.contractId).contract_type = req.body.contract_type;
                            }
                            interiorDesigner.save()
                                .then((interiorDesigner) => {
                                    interiorDesigners.findById(interiorDesigner._id)
                                        .then((interiorDesigner) => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(interiorDesigner);
                                        })
                                }, (err) => next(err));
                        }
                        else {
                            err = new Error('You cannot update this contract as you are not the author of it!');
                            err.status = 403;
                            return next(err);
                        }
                    }
                    else if (interiorDesigner == null) {
                        err = new Error('interiorDesigner ' + req.params.interiorDesignerId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                    else {
                        err = new Error('contract ' + req.params.contractId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                .catch((err) => next(err));
        })
        .delete((req, res, next) => {
            interiorDesigners.findById(req.params.interiorDesignerId)
                .then((interiorDesigner) => {
                    if (interiorDesigner != null && interiorDesigner.contract.id(req.params.contractId) != null) {
                        var req_contract_id = interiorDesigner.contract.id(req.params.contractId);
                        if (req_contract_id) {
                            interiorDesigner.contract.id(req.params.contractId).remove();
                            interiorDesigner.save()
                                .then((interiorDesigner) => {
                                    interiorDesigners.findById(interiorDesigner._id)
                                        .then((interiorDesigner) => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(interiorDesigner);
                                        })
                                }, (err) => next(err));
                        }
                        else {
                            err = new Error('You cannot delete this contract as you are not the author of it!');
                            err.status = 403;
                            return next(err);
                        }
                    }
                    else if (interiorDesigner == null) {
                        err = new Error('interiorDesigner ' + req.params.interiorDesignerId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                    else {
                        err = new Error('contract ' + req.params.contractId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                .catch((err) => next(err));
        });
    

module.exports = interiorDesignerRouter;