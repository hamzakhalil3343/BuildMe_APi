const mongoose = require('mongoose');
const Schema = mongoose.Schema;


 reviewSchema = new Schema({
   
    name:{
        type:String,
        default:'',
     },
    comment:{
        type:String,
        default:'',
     }
}, {
    timestamps: true
});

var reviews = mongoose.model('review', reviewSchema);

module.exports = reviews;