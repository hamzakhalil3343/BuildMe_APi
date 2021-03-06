const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var reviewSchema = new Schema({
    name:{
        type:String,
        default:''
    },
    comment: {
        type: String,
        default: ''
    }
    
   
    
}, {
    timestamps: true
});

 labourSchema = new Schema({
     labour_id:{
         type:String,
         required:true,
         default:''
     },
     
    profile_name:{
        type: String,
        required : false,
        default:''

    },
    labour_Type: {
        type: String,
        required: false,
        default:''
    },
    hrs_worked: {
        type: Number,
        required: false,
        default:0
    },
    labour_rate:{
        type: String,
        required : false,
        default:''
    },
    TeamPart:{
        type: String,
        required : false,
        default:''

    },
    TeamDetails:{
        type: String,
        required : false,
        default:''

    },
    Rating:{
        type: Number,
        required : false,
        default: 0
        

    },
    Reviews:[reviewSchema],
    isAuthenticated: {
        type: Boolean
        
    }
}, {
    timestamps: true
});

var labours = mongoose.model('labour', labourSchema);

module.exports = labours;