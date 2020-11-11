const express = require('express');
const bodyParser = require('body-parser');

const shopRouter = express.Router();
const shops = require('../models/shop');
shopRouter.use(bodyParser.json());
//Route of the shops
shopRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    shops.find({})
    .then((shops) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(shops);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    shops.create(req.body)
    .then((shop) => {
        console.log('shop  Created ', shop);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(shop);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /shopes');
})
.delete((req, res, next) => {
    shops.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err)); 
});
//Route to shop ID 
shopRouter.route('/:shopId')
.get((req,res,next) => {
    shops.findById(req.params.shopId)
    .then((shop) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(shop);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /shops/'+ req.params.shopId);
})
.put((req, res, next) => {
    shops.findByIdAndUpdate(req.params.shopId, {
        $set: req.body
    }, { new: true })
    .then((shop) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(shop);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    shops.findByIdAndRemove(req.params.shopId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});
//Route to Iron 
shopRouter.route('/:shopId/iron')
.get((req,res,next) => {
    shops.findById(req.params.shopId)
    .then((shop) => {
        if (shop != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(shop.iron);
        }
        else {
            err = new Error('shop ' + req.params.shopId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    shops.findById(req.params.shopId)
    .then((shop) => {
        if (shop != null) {
            // console.log('req of user  id ',req.user._id);
            // req.body.author = req.user._id;
            console.log('req of body',req.body);

            shop.iron.push(req.body);

            shop.save()
            .then((shop) => {
                shops.findById(shop._id)
               
                .then((shop) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(shop);
                })            
            }, (err) => next(err));
        }
        else {
            err = new Error('shop ' + req.params.shopId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /shopes/'
        + req.params.shopId + '/iron');
})
.delete((req, res, next) => {
    shops.findById(req.params.shopId)
    .then((shop) => {
        if (shop != null) {
            for (var i = (shop.iron.length -1); i >= 0; i--) {
                shop.iron.id(shop.iron[i]._id).remove();
            }
            shop.save()
            .then((shop) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(shop);                
            }, (err) => next(err));
        }
        else {
            err = new Error('shop ' + req.params.shopId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err)); 
});


//Route of  iron by ID 


shopRouter.route('/:shopId/iron/:ironId')
.get((req,res,next) => {
    shops.findById(req.params.shopId)
    .then((shop) => {
        if (shop != null && shop.iron.id(req.params.ironId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(shop.iron.id(req.params.ironId));
        }
        else if (shop == null) {
            err = new Error('shop ' + req.params.shopId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Iron ' + req.params.ironId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /shops/'+ req.params.shopId
        + '/iron/' + req.params.ironId);
})
.put((req, res, next) => {
    shops.findById(req.params.shopId)
    .then((shop) => {
        if (shop != null && shop.iron.id(req.params.ironId) != null) {
            // check if the user updating the iron is the same one who posted it
            // in the first place
            var req_iron_id = shop.iron.id(req.params.ironId);
            if (req_iron_id) {
                if (req.body.price) {
                    shop.iron.id(req.params.ironId).price = req.body.price;
                }
                if (req.body.quantitie) {
                    shop.iron.id(req.params.ironId).quantitie = req.body.quantitie;
                }
                if (req.body.iron) {
                    shop.iron.id(req.params.ironId).iron = req.body.iron;                
                }
                shop.save()
                .then((shop) => {
                    shops.findById(shop._id)
                    .then((shop) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(shop);  
                    })              
                }, (err) => next(err));
            }
            else {
                err = new Error('You cannot update this iron as you are not the author of it!');
                err.status = 403;
                return next(err);
            }
        }
        else if (shop == null) {
            err = new Error('shop ' + req.params.shopId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('iron ' + req.params.ironId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    shops.findById(req.params.shopId)
    .then((shop) => {
        if (shop != null && shop.iron.id(req.params.ironId) != null) {
            var req_iron_id = shop.iron.id(req.params.ironId);
            if (req_iron_id) {
                shop.iron.id(req.params.ironId).remove();
                shop.save()
                .then((shop) => {
                    shops.findById(shop._id)
                    .then((shop) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(shop);  
                    })               
                }, (err) => next(err));
            }
            else {
                err = new Error('You cannot delete this iron as you are not the author of it!');
                err.status = 403;
                return next(err);
            }
        }
        else if (shop == null) {
            err = new Error('shop ' + req.params.shopId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('iron ' + req.params.ironId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});
module.exports = shopRouter;