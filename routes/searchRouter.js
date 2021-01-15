var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

const shops = require('../models/shop');
router.use(bodyParser.json());

// router.post('/', function(req, res, next) {
//     payments.create(req.body)
//     .then((payment) => {
//         console.log('payment  Added ', payment);
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(payment);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// });
router.get('/:shopname', function(req, res, next) {
   // console.log('name',req.params.shopname);
   
        shops.find({shop_name:req.params.shopname})
        .then((shop) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            console.log('shop',shop);
            shop.forEach(element => {
                res.json(element);
            });
           // res.send(shop);
        }, (err) =>{ next(err)})
        .catch((err) => { next(err)});

    
   
});
// router.get('/:fname', function(req, res, next) {
//      console.log('name',req.params.fname);
     
//          shops.find({honour_firstname:req.params.fname})
//          .then((shop) => {
//              res.statusCode = 200;
//              res.setHeader('Content-Type', 'application/json');
//              console.log('shop',shop);
//              shop.forEach(element => {
//                  res.json(element);
//              });
//             // res.send(shop);
//          }, (err) =>{ console.log(err);next(err)})
//          .catch((err) => { console.log(err);next(err)});
 
     
    
//  });
// //  router.get('l_name/:name', function(req, res, next) {
// //     // console.log('name',req.params.shopname);
    
// //          shops.find({honour_lastname:req.params.fname})
// //          .then((shop) => {
// //              res.statusCode = 200;
// //              res.setHeader('Content-Type', 'application/json');
// //              console.log('shop',shop);
// //              shop.forEach(element => {
// //                  res.json(element);
// //              });
// //             // res.send(shop);
// //          }, (err) =>{ console.log(err);next(err)})
// //          .catch((err) => { console.log(err);next(err)});
 
     
    
// //  });

module.exports = router;