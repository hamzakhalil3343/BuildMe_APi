const mongoose = require('mongoose');
const Schema = mongoose.Schema;

 labourTeamSchema = new Schema({
     project_Name:{
         type:String,
         required:true,
         default:''
     },
     
    name:{
        type: String,
        required : false,
        default:''

    },
    details: {
        type: String,
        required: false,
        default:''
    }
   
}, {
    timestamps: true
});

var labourTeams = mongoose.model('labourTeam', labourTeamSchema);

module.exports = labourTeams;