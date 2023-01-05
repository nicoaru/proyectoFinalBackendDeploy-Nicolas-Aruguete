const mongoose = require('mongoose');
const { ProductoSchema } = require('./productosModel');
const {Schema, model} = mongoose
ProductoSchema


const ItemCarritoSchema = new Schema({
    producto: {type: ProductoSchema, required: true},
    cantidad: {type: Number, required: true, default: 0},
}, {timestamps: true});


module.exports = {ItemCarritoSchema}


