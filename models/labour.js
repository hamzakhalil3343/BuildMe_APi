const mongoose = require('mongoose');
const Schema = mongoose.Schema;


 labourSchema = new Schema({
    labour_Type: {
        type: String,
        required: false
    },
    labour_rate:{
        type: String,
        required : false

    },
    isAuthenticated: {
        type: Boolean
        
    }
}, {
    timestamps: true
});

var labours = mongoose.model('labour', labourSchema);

module.exports = labours;