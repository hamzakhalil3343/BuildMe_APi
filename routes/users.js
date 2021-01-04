var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var passport=require('passport');
var User = require('../models/user');
const labours = require('../models/labour');
const contractors = require('../models/contractor');
const customers = require('../models/customer');

var authenticate = require('../authenticate');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.use(bodyParser.json());

router.post('/signup', (req, res, next) => {
   console.log('user is ',req.body);
  User.register(new User({username: req.body.username,firstname:req.body.firstname,lastname:req.body.lastname,user_type:req.body.user_type}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      passport.authenticate('local')(req, res, () => {
        console.log('req.user_type',req.body.user_type);
        if (req.body.user_type === "labour"){
          labours.create({labour_id:req.user._id})
          .then((labour) => {
              // labour._id=User._id;
              console.log('labour  Created ', labour);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(labour);
          }, (err) => next(err))
          .catch((err) => next(err));
        }
        else if(req.body.user_type === "contractor"){
          contractors.create({contractor_id:req.user._id})
          .then((contractor) => {
              // labour._id=User._id;
              console.log('contractor  Created ', contractor);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(contractor);
          }, (err) => next(err))
          .catch((err) => next(err));
        }
        else if(req.body.user_type === "customer"){
          customers.create({customer_id:req.user._id,profile_name:req.user.firstname})
          .then((customer) => {
              // labour._id=User._id;
              console.log('customer  Created ', customer);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(customer);
          }, (err) => next(err))
          .catch((err) => next(err));
        }
        else{
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        }
       
      });
    }
  });
});
router.post('/login', passport.authenticate('local'), (req, res) => {
  console.log(req.body);
  var token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.json({success: true,id:req.user._id, token: token, status: 'You are successfully logged in!'});
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;