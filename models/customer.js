const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var contractSchema = new Schema({
    name:{
        type:String,
        default:''
    },
    details: {
        type: String,
        default: ''
    }
    
   
    
}, {
    timestamps: true
});

 customerSchema = new Schema({
     customer_id:{
         type:String,
         required:true,
         default:''
     },
     
    profile_name:{
        type: String,
        required : false,
        default:''

    },
    contracts:[contractSchema]
}, {
    timestamps: true
});

var customers = mongoose.model('customer', customerSchema);

module.exports = customers;