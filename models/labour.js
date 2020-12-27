const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var reviewSchema = new Schema({
    name:{
        type:String,
        default:''
    },
    comment: {
        type: String,
        default: 0
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
    labour_Type: {
        type: String,
        required: false,
        default:''
    },
    hrs_worked: {
        type: Number,
        required: false
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
    Rating:{
        type: Number,
        required : false,
        

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