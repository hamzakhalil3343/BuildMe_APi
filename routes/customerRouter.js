const express = require('express');
const bodyParser = require('body-parser');

const customerRouter = express.Router();
const customers = require('../models/customer');
customerRouter.use(bodyParser.json());
//Route of the customers
customerRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        customers.find({})
            .then((customers) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(customers);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        // res.statusCode = 403;
        // res.end('POST  operation not supported on /customeres From here !');
        customers.create(req.body)
            .then((customer) => {
                console.log('customer  Created ', customer);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(customer);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /customeres');
    })
    .delete((req, res, next) => {
        customers.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });
//Route to customer ID 
customerRouter.route('/:customerId')
    .get((req, res, next) => {
        customers.find({ customer_id: req.params.customerId })
            .then((customer) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');

                customer.forEach(element => {
                    res.json(element);
                });

            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /customers/' + req.params.customerId);
    })
    .put((req, res, next) => {
        var query = { 'customer_id': req.params.customerId };
        
        if (req.body.profile_name != undefined ){
            customers.findOneAndUpdate(query, {"profile_name":req.body.profile_name,"hrs_worked":req.body.hrs_worked,"customer_Type":req.body.customer_type,"customer_rate":req.body.customer_rate}, { upsert: true }, function (err, doc) {
                if (err) {console.log(err);return res.send(500, { error: err });}
                return res.send('Succesfully .');
            });
        }
        

        if (req.body.TeamPart != undefined ){
            customers.findOneAndUpdate(query, {"TeamPart":req.body.TeamPart,"TeamDetails":req.body.TeamDetails}, { upsert: true }, function (err, doc) {
                if (err) {console.log(err);return res.send(500, { error: err });}
                return res.send('Succesfully saved.');
            });
        }
        if (req.body.comment != undefined ){
            customers.findById(req.params.customerId)
            .then((customer) => {
                if (customer != null) {
                    // console.log('req of user  id ',req.user._id);
                    // req.body.author = req.user._id;
                    console.log('req of body', req.body);
                    console.log('customer is ', customer);

                     customer.Reviews.push(req.body);

                    customer.save()
                        .then((customer) => {

                            customer.update({"Rating":(req.body.rating+customer.Rating)/2}, { upsert: true }, function (err, doc) {
                                if (err) {console.log(err);return res.send(500, { error: err });}
                                return res.send('Succesfully saved.');
                            });
                                    // res.statusCode = 200;
                                    // res.setHeader('Content-Type', 'application/json');
                                    // res.json(customer);
                                
                        }, (err) => next(err));
                }
                else {
                    err = new Error('customer ID  ' + query + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
          
        }
        
        // customers.findByIdAndUpdate(req.params.customerId, {
        //     $set: req.body
        // }, { new: true })
        //     .then((customer) => {
        //         res.statusCode = 200;
        //         res.setHeader('Content-Type', 'application/json');
        //         res.json(customer);
        //     }, (err) => next(err))
        //     .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        customers.findByIdAndRemove(req.params.customerId)
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });
    //Route to contract 
    customerRouter.route('/:customerId/contract')
        .get((req, res, next) => {
            customers.findById(req.params.customerId)
                .then((customer) => {
                    if (customer != null) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(customer.contract);
                    }
                    else {
                        err = new Error('customer ' + req.params.customerId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                .catch((err) => next(err));
        })
        .post((req, res, next) => {
            // var query = { 'customer_id': req.params.customerId };
        

            // customers.findOneAndUpdate(query, "contracts":[{"name":req.body.name,"details":req.body.details}], { upsert: true }, function (err, doc) {
            //     if (err) {console.log(err);return res.send(500, { error: err });}
            //     return res.send('Succesfully saved.');
            // });
            customers.findById(req.params.customerId)
                .then((customer) => {
                    if (customer != null) {
                        // console.log('req of user  id ',req.user._id);
                        // req.body.author = req.user._id;
                        console.log('req of body', req.body);
                     
                        customer.contracts.push({"name":req.body.name,"details":req.body.details});
    
                        customer.save()
                            .then((customer) => {
                                customers.findById(customer._id)
    
                                    .then((customer) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(customer);
                                    })
                            }, (err) => next(err));
                    }
                    else {
                        err = new Error('customer ' + req.params.customerId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                .catch((err) => next(err));
        })
        .put((req, res, next) => {
            res.statusCode = 403;
            res.end('PUT operation not supported on /customeres/'
                + req.params.customerId + '/contract');
        })
        .delete((req, res, next) => {
            customers.findById(req.params.customerId)
                .then((customer) => {
                    if (customer != null) {
                        for (var i = (customer.contract.length - 1); i >= 0; i--) {
                            customer.contract.id(customer.contract[i]._id).remove();
                        }
                        customer.save()
                            .then((customer) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(customer);
                            }, (err) => next(err));
                    }
                    else {
                        err = new Error('customer ' + req.params.customerId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                .catch((err) => next(err));
        });
    
    
    //Route of  contract by ID 
    
    
    customerRouter.route('/:customerId/contract/:contractId')
        .get((req, res, next) => {
            customers.findById(req.params.customerId)
                .then((customer) => {
                    if (customer != null && customer.contract.id(req.params.contractId) != null) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(customer.contract.id(req.params.contractId));
                    }
                    else if (customer == null) {
                        err = new Error('customer ' + req.params.customerId + ' not found');
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
            res.end('POST operation not supported on /customers/' + req.params.customerId
                + '/contract/' + req.params.contractId);
        })
        .put((req, res, next) => {
            customers.findById(req.params.customerId)
                .then((customer) => {
                    if (customer != null && customer.contract.id(req.params.contractId) != null) {
                        // check if the user updating the contract is the same one who posted it
                        // in the first place
                        var req_contract_id = customer.contract.id(req.params.contractId);
                        if (req_contract_id) {
                            if (req.body.price) {
                                customer.contract.id(req.params.contractId).price = req.body.price;
                            }
                            if (req.body.quantitie) {
                                customer.contract.id(req.params.contractId).quantitie = req.body.quantitie;
                            }
                            if (req.body.name) {
                                customer.contract.id(req.params.contractId).name = req.body.name;
                            }
                            if (req.body.contract_type) {
                                customer.contract.id(req.params.contractId).contract_type = req.body.contract_type;
                            }
                            customer.save()
                                .then((customer) => {
                                    customers.findById(customer._id)
                                        .then((customer) => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(customer);
                                        })
                                }, (err) => next(err));
                        }
                        else {
                            err = new Error('You cannot update this contract as you are not the author of it!');
                            err.status = 403;
                            return next(err);
                        }
                    }
                    else if (customer == null) {
                        err = new Error('customer ' + req.params.customerId + ' not found');
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
            customers.findById(req.params.customerId)
                .then((customer) => {
                    if (customer != null && customer.contract.id(req.params.contractId) != null) {
                        var req_contract_id = customer.contract.id(req.params.contractId);
                        if (req_contract_id) {
                            customer.contract.id(req.params.contractId).remove();
                            customer.save()
                                .then((customer) => {
                                    customers.findById(customer._id)
                                        .then((customer) => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json(customer);
                                        })
                                }, (err) => next(err));
                        }
                        else {
                            err = new Error('You cannot delete this contract as you are not the author of it!');
                            err.status = 403;
                            return next(err);
                        }
                    }
                    else if (customer == null) {
                        err = new Error('customer ' + req.params.customerId + ' not found');
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
    

module.exports = customerRouter;