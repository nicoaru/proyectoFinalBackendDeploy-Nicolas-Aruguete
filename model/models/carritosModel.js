const mongoose = require('mongoose');
const { ItemCarritoSchema } = require('./itemCarritoSchema');
const {Schema, model} = mongoose


const CarritoSchema = new Schema({
    userId: {type: String, required: true, unique: true},
    items: {type: [ItemCarritoSchema], required: true}
}, {timestamps: true});
  
  
const CarritosModel = model('carritos', CarritoSchema);


module.exports = {CarritosModel, CarritoSchema}


// ver si se puede definir un schema para los productos dentro del array