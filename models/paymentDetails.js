const mongoose = require('mongoose');
const Schema = mongoose.Schema;


 paymentSchema = new Schema({
   
    name:{
        type:String,
        default:'',
     },
    exp_date:{
        type:String,
        default:'',
     },
    cvc:{
        type:String,
        default:'',
     },
    number:{
        type:String,
        default:'',
     },
    amount:{
        type:Number,
        default:0,
     },
     verification:{
         type:Boolean,
         default:false
     }
}, {
    timestamps: true
});

var payments = mongoose.model('payment', paymentSchema);

module.exports = payments;