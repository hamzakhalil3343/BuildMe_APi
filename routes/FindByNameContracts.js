var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

const customers = require('../models/customer');
router.use(bodyParser.json());


router.get('/:customername',function (req, res, next) {
   // console.log('name',req.params.customername);
   
        customers.find({})
        .then((customer) => {
                     customer.forEach(element => {
                         element.contracts.forEach(element2=>{
                            if(element2.accepted_by == req.params.customername){
                                res.json(element);
                            }
                            
                         })
                      
                });
            // customer.contracts.find({accepted_by:req.params.customername}).then((contract)=>{
            //     res.statusCode = 200;
            //     res.setHeader('Content-Type', 'application/json');
            //     console.log('customer',customer);
            //     customer.forEach(element => {
            //         res.json(element);
            //     });
            // })
           
           // res.send(customer);
        }, (err) =>{ next(err)})
        .catch((err) => { next(err)});

    
   
});


module.exports = router;