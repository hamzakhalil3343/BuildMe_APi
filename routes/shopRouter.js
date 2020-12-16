const express = require('express');
const bodyParser = require('body-parser');

const shopRouter = express.Router();
const shops = require('../models/shop');
shopRouter.use(bodyParser.json());
//shop login 
shopRouter.post('/ShopLogin',  async (req, res) => {
    const body = req.body;
    console.log('req.body', body);

    const shop_name = body.shop_name;

    // lets check if shop_name exists

    const result = await shops.findOne({"shop_name":  shop_name});
    console.log('result is',result);
    if(result===null) // this means result is null
    { console.log('User Not Exists')
      res.status(401).send({
        Error: 'This user doesnot exists. Please signup first'
       });
    }
    else{
      // shop_name did exist
      // so lets match password

      if(body.password === result.password){

        // great, allow this user access

        console.log('match');

        res.send({message: 'Successfully Logged in',id:result.id});
      }

        else{

          console.log('password doesnot match');

          res.status(401).send({message: 'Wrong shop_name or Password'});
        }


    }

  });
//Route of the shops
shopRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
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
    .get((req, res, next) => {
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
        res.end('POST operation not supported on /shops/' + req.params.shopId);
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
    .get((req, res, next) => {
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
                    console.log('req of body', req.body);

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
                    for (var i = (shop.iron.length - 1); i >= 0; i--) {
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
    .get((req, res, next) => {
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
        res.end('POST operation not supported on /shops/' + req.params.shopId
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
                        if (req.body.name) {
                            shop.iron.id(req.params.ironId).name = req.body.name;
                        }
                        if (req.body.iron_type) {
                            shop.iron.id(req.params.ironId).iron_type = req.body.iron_type;
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






//Glass router  Goes Here 


shopRouter.route('/:shopId/glass')
    .get((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(shop.glass);
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
                    console.log('req of body', req.body);

                    shop.glass.push(req.body);

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
            + req.params.shopId + '/glass');
    })
    .delete((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null) {
                    for (var i = (shop.glass.length - 1); i >= 0; i--) {
                        shop.glass.id(shop.glass[i]._id).remove();
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


//Route of  glass by ID 


shopRouter.route('/:shopId/glass/:glassId')
    .get((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.glass.id(req.params.glassId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(shop.glass.id(req.params.glassId));
                }
                else if (shop == null) {
                    err = new Error('shop ' + req.params.shopId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('glass ' + req.params.glassId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /shops/' + req.params.shopId
            + '/glass/' + req.params.glassId);
    })
    .put((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.glass.id(req.params.glassId) != null) {
                    // check if the user updating the glass is the same one who posted it
                    // in the first place
                    var req_glass_id = shop.glass.id(req.params.glassId);
                    if (req_glass_id) {
                        if (req.body.price) {
                            shop.glass.id(req.params.glassId).price = req.body.price;
                        }
                        if (req.body.quantitie) {
                            shop.glass.id(req.params.glassId).quantitie = req.body.quantitie;
                        }
                        if (req.body.glass) {
                            shop.glass.id(req.params.glassId).glass = req.body.glass;
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
                        err = new Error('You cannot update this glass as you are not the author of it!');
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
                    err = new Error('glass ' + req.params.glassId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.glass.id(req.params.glassId) != null) {
                    var req_glass_id = shop.glass.id(req.params.glassId);
                    if (req_glass_id) {
                        shop.glass.id(req.params.glassId).remove();
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
                        err = new Error('You cannot delete this glass as you are not the author of it!');
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
                    err = new Error('glass ' + req.params.glassId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });


//Wood Router ! 

shopRouter.route('/:shopId/wood')
    .get((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(shop.wood);
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
                    console.log('req of body', req.body);

                    shop.wood.push(req.body);

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
            + req.params.shopId + '/wood');
    })
    .delete((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null) {
                    for (var i = (shop.wood.length - 1); i >= 0; i--) {
                        shop.wood.id(shop.wood[i]._id).remove();
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


//Route of  wood by ID 


shopRouter.route('/:shopId/wood/:woodId')
    .get((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.wood.id(req.params.woodId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(shop.wood.id(req.params.woodId));
                }
                else if (shop == null) {
                    err = new Error('shop ' + req.params.shopId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('wood ' + req.params.woodId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /shops/' + req.params.shopId
            + '/wood/' + req.params.woodId);
    })
    .put((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.wood.id(req.params.woodId) != null) {
                    // check if the user updating the wood is the same one who posted it
                    // in the first place
                    var req_wood_id = shop.wood.id(req.params.woodId);
                    if (req_wood_id) {
                        if (req.body.price) {
                            shop.wood.id(req.params.woodId).price = req.body.price;
                        }
                        if (req.body.quantitie) {
                            shop.wood.id(req.params.woodId).quantitie = req.body.quantitie;
                        }
                        if (req.body.wood) {
                            shop.wood.id(req.params.woodId).wood = req.body.wood;
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
                        err = new Error('You cannot update this wood as you are not the author of it!');
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
                    err = new Error('wood ' + req.params.woodId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.wood.id(req.params.woodId) != null) {
                    var req_wood_id = shop.wood.id(req.params.woodId);
                    if (req_wood_id) {
                        shop.wood.id(req.params.woodId).remove();
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
                        err = new Error('You cannot delete this wood as you are not the author of it!');
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
                    err = new Error('wood ' + req.params.woodId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });


//Sanitary Shema ! 

shopRouter.route('/:shopId/sanitary')
    .get((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(shop.sanitary);
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
                    console.log('req of body', req.body);

                    shop.sanitary.push(req.body);

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
            + req.params.shopId + '/sanitary');
    })
    .delete((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null) {
                    for (var i = (shop.sanitary.length - 1); i >= 0; i--) {
                        shop.sanitary.id(shop.sanitary[i]._id).remove();
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


//Route of  sanitary by ID 


shopRouter.route('/:shopId/sanitary/:sanitaryId')
    .get((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.sanitary.id(req.params.sanitaryId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(shop.sanitary.id(req.params.sanitaryId));
                }
                else if (shop == null) {
                    err = new Error('shop ' + req.params.shopId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('sanitary ' + req.params.sanitaryId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /shops/' + req.params.shopId
            + '/sanitary/' + req.params.sanitaryId);
    })
    .put((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.sanitary.id(req.params.sanitaryId) != null) {
                    // check if the user updating the sanitary is the same one who posted it
                    // in the first place
                    var req_sanitary_id = shop.sanitary.id(req.params.sanitaryId);
                    if (req_sanitary_id) {
                        if (req.body.price) {
                            shop.sanitary.id(req.params.sanitaryId).price = req.body.price;
                        }
                        if (req.body.quantitie) {
                            shop.sanitary.id(req.params.sanitaryId).quantitie = req.body.quantitie;
                        }
                        if (req.body.sanitary) {
                            shop.sanitary.id(req.params.sanitaryId).sanitary = req.body.sanitary;
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
                        err = new Error('You cannot update this sanitary as you are not the author of it!');
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
                    err = new Error('sanitary ' + req.params.sanitaryId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.sanitary.id(req.params.sanitaryId) != null) {
                    var req_sanitary_id = shop.sanitary.id(req.params.sanitaryId);
                    if (req_sanitary_id) {
                        shop.sanitary.id(req.params.sanitaryId).remove();
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
                        err = new Error('You cannot delete this sanitary as you are not the author of it!');
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
                    err = new Error('sanitary ' + req.params.sanitaryId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });




// Tiles Schema ! 

shopRouter.route('/:shopId/tiles')
    .get((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(shop.tiles);
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
                    console.log('req of body', req.body);

                    shop.tiles.push(req.body);

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
            + req.params.shopId + '/tiles');
    })
    .delete((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null) {
                    for (var i = (shop.tiles.length - 1); i >= 0; i--) {
                        shop.tiles.id(shop.tiles[i]._id).remove();
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


//Route of  tiles by ID 


shopRouter.route('/:shopId/tiles/:tilesId')
    .get((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.tiles.id(req.params.tilesId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(shop.tiles.id(req.params.tilesId));
                }
                else if (shop == null) {
                    err = new Error('shop ' + req.params.shopId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('tiles ' + req.params.tilesId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /shops/' + req.params.shopId
            + '/tiles/' + req.params.tilesId);
    })
    .put((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.tiles.id(req.params.tilesId) != null) {
                    // check if the user updating the tiles is the same one who posted it
                    // in the first place
                    var req_tiles_id = shop.tiles.id(req.params.tilesId);
                    if (req_tiles_id) {
                        if (req.body.price) {
                            shop.tiles.id(req.params.tilesId).price = req.body.price;
                        }
                        if (req.body.quantitie) {
                            shop.tiles.id(req.params.tilesId).quantitie = req.body.quantitie;
                        }
                        if (req.body.tiles) {
                            shop.tiles.id(req.params.tilesId).tiles = req.body.tiles;
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
                        err = new Error('You cannot update this tiles as you are not the author of it!');
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
                    err = new Error('tiles ' + req.params.tilesId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.tiles.id(req.params.tilesId) != null) {
                    var req_tiles_id = shop.tiles.id(req.params.tilesId);
                    if (req_tiles_id) {
                        shop.tiles.id(req.params.tilesId).remove();
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
                        err = new Error('You cannot delete this tiles as you are not the author of it!');
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
                    err = new Error('tiles ' + req.params.tilesId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });


// paints Routes !


shopRouter.route('/:shopId/paints')
    .get((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(shop.paints);
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
                    console.log('req of body', req.body);

                    shop.paints.push(req.body);

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
            + req.params.shopId + '/paints');
    })
    .delete((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null) {
                    for (var i = (shop.paints.length - 1); i >= 0; i--) {
                        shop.paints.id(shop.paints[i]._id).remove();
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


//Route of  paints by ID 


shopRouter.route('/:shopId/paints/:paintsId')
    .get((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.paints.id(req.params.paintsId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(shop.paints.id(req.params.paintsId));
                }
                else if (shop == null) {
                    err = new Error('shop ' + req.params.shopId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('paints ' + req.params.paintsId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /shops/' + req.params.shopId
            + '/paints/' + req.params.paintsId);
    })
    .put((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.paints.id(req.params.paintsId) != null) {
                    // check if the user updating the paints is the same one who posted it
                    // in the first place
                    var req_paints_id = shop.paints.id(req.params.paintsId);
                    if (req_paints_id) {
                        if (req.body.price) {
                            shop.paints.id(req.params.paintsId).price = req.body.price;
                        }
                        if (req.body.quantitie) {
                            shop.paints.id(req.params.paintsId).quantitie = req.body.quantitie;
                        }
                        if (req.body.paints) {
                            shop.paints.id(req.params.paintsId).paints = req.body.paints;
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
                        err = new Error('You cannot update this paints as you are not the author of it!');
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
                    err = new Error('paints ' + req.params.paintsId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.paints.id(req.params.paintsId) != null) {
                    var req_paints_id = shop.paints.id(req.params.paintsId);
                    if (req_paints_id) {
                        shop.paints.id(req.params.paintsId).remove();
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
                        err = new Error('You cannot delete this paints as you are not the author of it!');
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
                    err = new Error('paints ' + req.params.paintsId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });



// Electric stores ! 

shopRouter.route('/:shopId/electricStores')
    .get((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(shop.electricStores);
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
                    console.log('req of body', req.body);

                    shop.electricStores.push(req.body);

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
            + req.params.shopId + '/electricStores');
    })
    .delete((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null) {
                    for (var i = (shop.electricStores.length - 1); i >= 0; i--) {
                        shop.electricStores.id(shop.electricStores[i]._id).remove();
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


//Route of  electricStores by ID 


shopRouter.route('/:shopId/electricStores/:electricStoresId')
    .get((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.electricStores.id(req.params.electricStoresId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(shop.electricStores.id(req.params.electricStoresId));
                }
                else if (shop == null) {
                    err = new Error('shop ' + req.params.shopId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('electricStores ' + req.params.electricStoresId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /shops/' + req.params.shopId
            + '/electricStores/' + req.params.electricStoresId);
    })
    .put((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.electricStores.id(req.params.electricStoresId) != null) {
                    // check if the user updating the electricStores is the same one who posted it
                    // in the first place
                    var req_electricStores_id = shop.electricStores.id(req.params.electricStoresId);
                    if (req_electricStores_id) {
                        if (req.body.price) {
                            shop.electricStores.id(req.params.electricStoresId).price = req.body.price;
                        }
                        if (req.body.quantitie) {
                            shop.electricStores.id(req.params.electricStoresId).quantitie = req.body.quantitie;
                        }
                        if (req.body.electricStores) {
                            shop.electricStores.id(req.params.electricStoresId).electricStores = req.body.electricStores;
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
                        err = new Error('You cannot update this electricStores as you are not the author of it!');
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
                    err = new Error('electricStores ' + req.params.electricStoresId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.electricStores.id(req.params.electricStoresId) != null) {
                    var req_electricStores_id = shop.electricStores.id(req.params.electricStoresId);
                    if (req_electricStores_id) {
                        shop.electricStores.id(req.params.electricStoresId).remove();
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
                        err = new Error('You cannot delete this electricStores as you are not the author of it!');
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
                    err = new Error('electricStores ' + req.params.electricStoresId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });


                                         // Order Details Route !



shopRouter.route('/:shopId/order_details')
    .get((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(shop.order_details);
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
                    console.log('req of body', req.body);

                    shop.order_details.push(req.body);

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
            + req.params.shopId + '/order_details');
    })
    .delete((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null) {
                    for (var i = (shop.order_details.length - 1); i >= 0; i--) {
                        shop.order_details.id(shop.order_details[i]._id).remove();
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


//Route of  order_details by ID 


shopRouter.route('/:shopId/order_details/:order_detailsId')
    .get((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.order_details.id(req.params.order_detailsId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(shop.order_details.id(req.params.order_detailsId));
                }
                else if (shop == null) {
                    err = new Error('shop ' + req.params.shopId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('order_details ' + req.params.order_detailsId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /shops/' + req.params.shopId
            + '/order_details/' + req.params.order_detailsId);
    })
    .put((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.order_details.id(req.params.order_detailsId) != null) {
                    // check if the user updating the order_details is the same one who posted it
                    // in the first place
                    var req_order_details_id = shop.order_details.id(req.params.order_detailsId);
                    if (req_order_details_id) {
                        if (req.body.price) {
                            shop.order_details.id(req.params.order_detailsId).price = req.body.price;
                        }
                        if (req.body.quantitie) {
                            shop.order_details.id(req.params.order_detailsId).quantitie = req.body.quantitie;
                        }
                        if (req.body.order_details) {
                            shop.order_details.id(req.params.order_detailsId).order_details = req.body.order_details;
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
                        err = new Error('You cannot update this order_details as you are not the author of it!');
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
                    err = new Error('order_details ' + req.params.order_detailsId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete((req, res, next) => {
        shops.findById(req.params.shopId)
            .then((shop) => {
                if (shop != null && shop.order_details.id(req.params.order_detailsId) != null) {
                    var req_order_details_id = shop.order_details.id(req.params.order_detailsId);
                    if (req_order_details_id) {
                        shop.order_details.id(req.params.order_detailsId).remove();
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
                        err = new Error('You cannot delete this order_details as you are not the author of it!');
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
                    err = new Error('order_details ' + req.params.order_detailsId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

module.exports = shopRouter;