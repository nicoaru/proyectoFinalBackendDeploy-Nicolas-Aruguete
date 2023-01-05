const mongoose = require('mongoose');
const { ItemCarritoSchema } = require('./itemCarritoSchema');
const {Schema, model} = mongoose

const PedidoSchema = new Schema({
    userId: {type: String, required: true},
    nombre: {type: String},
    email: {type: String},
    direccion: {type: String},    
    items: {type: [ItemCarritoSchema], required: true},
    precioTotal: {type: Number},
    fecha: {type: Date, required: true, default: new Date}

}, {timestamps: true});



  
  
const PedidosModel = model('pedidos', PedidoSchema);


module.exports = {PedidosModel, PedidoSchema}


