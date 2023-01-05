const {ADMIN_TELEPHONE, ADMIN_EMAIL} = require('../../config/config.js')
const { PedidosRepository } = require('../../model/repositories/pedidos.repository.js')
const { CarritosRepository } = require('../../model/repositories/carritos.repository.js')
const {sendMail} = require('../nodeMailer.js')
const mongoose = require("mongoose")
const { CarritoSchema } = require('../../model/models/carritosModel.js')
const Types = mongoose.Types

// devuelve todos los pedidos correspondientes al usuario conectado
const getPedidos = async (req, res) => {

    try {
    const userId = req.user._id
    const pedidos = await PedidosRepository.getByFilter('userId', userId)
    res.status(200).json(pedidos)
    }
    catch(err){
        console.log("GET pedidos error => ", err)
        const error = {error: true, message: err.message}
        res.status(500).json(error)
    }
}

// devuelve el pedido con el id indicado
const getPedidoById = async (req, res) => {
    let idPedido = req.params.idPedido
    const userId = req.user._id    
    try {
        idPedido = Types.ObjectId(idPedido) 
    }
    catch(err) {
        const error = {error: true, message: err.message}
        res.status(400).json(error)
        return
    }
    
    try {
        const pedido = await PedidosRepository.getById(idPedido)

        if (pedido && !(pedido.userId === userId.toString())) {
            console.log(`${pedido.userId} => ${userId}`)
            const error = {error: true, message: `El pedido ${idPedido.toString()} no pertenece al usuario ${req.user.username}`}
            res.status(400).json(error)
        }
        else {
            res.status(400).json(pedido)
        }
    }
    catch(err) {
        const error = {error: true, message: err.message}
        res.status(500).json(error)
    }

}

// guarda un pedido nuevo
const savePedido = async (req, res) => {

    const userId = req.user._id

    try {
        let pedido
        let precioTotal = 0

        const carrito = await CarritosRepository.getOneByFilter('userId', userId)
        console.log("carrito => ", carrito)
        console.log("carrito.items => ", carrito.items)
        const items = carrito?.items

        if (items?.length < 1) {
            const error = {error: true, message: "No hay productos en el carrito"}
            res.status(400).json(error)
            return
        }

        items.forEach(elem => {
                precioTotal = precioTotal + Number(elem.producto.precio) * Number(elem.cantidad)
        }) 
        
        pedido = {
            userId: req.user._id,
            nombre: req.user.name,
            email: req.user.email,
            direccion: req.user.address,
            items: items,
            precioTotal: precioTotal,
            fecha: new Date
        } 

        const result = await PedidosRepository.save(pedido)
        console.log("result => ", result)
        
        res.status(200).json(result)   

        try {
            carrito.items.splice(0, carrito.items.length)
            const result = await carrito.save()
            console.log("se vació el carrito => ", result)
  
        }
        catch(err) {
            console.log("Error intentando vaciar el carrito luego de guardar el pedido")
        }

        try{
            // email al admin y al user notificando nuevo pedido
            const emailSubject = `Nuevo pedido de ${result.nombre} - ${result.email}`
            const emailHtmlBody = `<h3>Nombre: ${result.nombre}</h3>
                                    <h3>Email: ${result.email}</h3>
                                    <h3>Dirección: ${result.direccion}</h3>
                                    <h3>Productos: 
                                        ${result.items.map(elem => {
                                            return `<h4>${elem.cantidad} - ${elem.producto.nombre}</h4>`
                                        })}
                                    </h3>
                                    <h3>Total: $${result.precioTotal}</h3>`
            const notificationResults = await sendMail(emailSubject, emailHtmlBody, [ADMIN_EMAIL, result.email])
            console.log("Nuevo pedido admin notification result ", notificationResults)
        }
        catch(err) {
            console.log("error notificando nuevo pedido ", err.message)
        }
    }
    
    catch(err) {
        console.log("POST pedidos error => ", err)
        const error = {error: true, message: err.message}
        res.status(500).json(error)
    }

}


module.exports = {
    getPedidos,
    getPedidoById,
    savePedido
}