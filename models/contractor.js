const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var LabourTeam = new Schema({
    project_name:{
        type:String,
        default:''
    },
    name:{
        type:String,
        default:''
    },
    labour_type: {
        type: String,
        default: ''
    }
    
   
    
}, {
    timestamps: true
});

 contractorSchema = new Schema({
     contractor_id:{
         type:String,
         required:true,
         default:''
     },
     profile_name:{
        type:String,
        default:'',
     },
    labourTeam:[LabourTeam],
    isAuthenticated: {
        type: Boolean,
        default:false
        
    }
}, {
    timestamps: true
});

var contractors = mongoose.model('contractor', contractorSchema);

module.exports = contractors;