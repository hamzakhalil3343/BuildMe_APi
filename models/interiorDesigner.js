const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var contractSchema = new Schema({
    name:{
        type:String,
        default:''
    },
    isAuthenticated:{
        type:Boolean,
        required:false   
    },

    details: {
        type: String,
        default: ''
    },
    additionalDetails:{
        type:String,
        required:false,
        default:''

    }
    
   
    
}, {
    timestamps: true
});

 interiorDesignerSchema = new Schema({
     interiorDesigner_id:{
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

var interiorDesigners = mongoose.model('interiorDesigner', interiorDesignerSchema);

module.exports = interiorDesigners;