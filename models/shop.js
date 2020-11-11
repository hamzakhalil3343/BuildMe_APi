const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

//Iron schema
var ironSchema = new Schema({
    quantitie: {
        type: Number,
        default: 0
    },
    iron_type:{
        type:String,
        default:''
    },
    price: {
        type: Currency,
        min: 0
    }
    
}, {
    timestamps: true
});

//Glass schema
var glassSchema = new Schema({
    quantitie: {
        type: Number,
        default: 0
    },
    dimension:{
        type:String,
        default:''
    },
    glass_type:{
        type:String,
        default:''
    },
    price: {
        type: Currency,
        min: 0
    }
    
}, {
    timestamps: true
});


//Wood  schema
var woodSchema = new Schema({
    quantitie: {
        type: Number,
        default: 0
    },
    dimension:{
        type:String,
        default:''
    },
    wood_type:{
        type:String,
        default:''
    },
    price: {
        type: Currency,
        min: 0
    }
    
}, {
    timestamps: true
});


//Tiles  schema
var tileSchema = new Schema({
    quantitie: {
        type: Number,
        default: 0
    },
    dimension:{
        type:String,
        default:''
    },
    iron_type:{
        type:String,
        default:''
    },
    price: {
        type: Currency,
        min: 0
    }
    
}, {
    timestamps: true
});


//sanitary  schema
var sanitarySchema = new Schema({
    quantitie: {
        type: Number,
        default: 0
    },
    name:{
        type:String,
        default:''
    },
    sanitary_type:{
        type:String,
        default:''
    },
    price: {
        type: Currency,
        min: 0
    }
    
}, {
    timestamps: true
});

//paints  schema
var paintsSchema = new Schema({
    quantitie: {
        type: Number,
        default: 0
    },
    name:{
        type:String,
        default:''
    },
    paint_type:{
        type:String,
        default:''
    },
    price: {
        type: Currency,
        min: 0
    }
    
}, {
    timestamps: true
});

//Electric store  schema
var es_Schema = new Schema({
    quantitie: {
        type: Number,
        default: 0
    },
    name:{
        type:String,
        default:''
    },
    Electric_type:{
        type:String,
        default:''
    },
    price: {
        type: Currency,
        min: 0
    }
    
}, {
    timestamps: true
});
//Order details  schema
var orderSchema = new Schema({
    name:{
        type:String,
        default:''
    },
    quantitie: {
        type: Number,
        default: 0
    },
    
    contractor_name:{
        type:String,
        default:''
    }
    
}, {
    timestamps: true
});
const shopSchema = new Schema({
    shop_name: {
        type: String,
        required: false,
        unique: true
    },
    isAuthenticated: {
        type: Boolean
        
    }, 
    iron: [ironSchema],
    glass: [glassSchema],
    wood: [woodSchema],
    sanitay:[sanitarySchema],
    tiles:[tileSchema],
    paints:[paintsSchema],
    electricStores:[es_Schema],
    order_details:[orderSchema]
}, {
    timestamps: true
});

var shops = mongoose.model('shop', shopSchema);

module.exports = shops;