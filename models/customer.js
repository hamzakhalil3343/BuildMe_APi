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
    },
    accepted_by:{
        type: String,
        required: false
    },
    Estimation:{
        type: String,
        default: '',
        
    },
    contract_type:{
        type: String,
        default: '',
        required:true
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