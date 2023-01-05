const { CarritosRepository } = require('../../model/repositories/carritos.repository.js')
const mongoose = require("mongoose")
const Types = mongoose.Types

// devuelve el carrito correspondiente al usuario loggeado
const getCarrito = async (req, res) => {
    try {
        const userId = req.user._id
        const carrito = await CarritosRepository.getOneByFilter('userId', userId) 
    
        res.status(200).json(carrito)
    }
    catch(err) {
        const error = {error: true, message: err.message}
        res.status(500).json(error)
    }
}


// devuelve todos los productos agregados al carrito correspondiente al usuario loggeado
const getProductosCarrito = async (req, res) => {
    try {
        const userId = req.user._id
        const carrito = await CarritosRepository.getOneByFilter('userId', userId)

        if(carrito) {
            const itemsCarrito = carrito.items
            console.log('carrito => ', carrito)
            console.log('productosCarrito => ', carrito.items)
            res.status(200).json(itemsCarrito)    
        }
        else {
            const error = {error: true, message: "El carrito no existe"}
            res.status(400).json(error)
        }

    }
    catch(err) {
        const error = {error: true, message: err.message}
        res.status(500).json(error)
    }
}

// agrega un item al carrito correspondiente al usuario loggeado
// si por alguna razón no exite el carrito, lo crea
const saveItemCarrito = async (req, res) => {
    try {
        const itemToAdd = req.body
        const userId = req.user._id
        const carrito = await CarritosRepository.getOneByFilter("userId", userId)
        console.log("carrito ", carrito)
        console.log("itemToAdd => ", itemToAdd)
        const itemIndexInCart = carrito?.items.findIndex(item => item.producto._id.toString() === itemToAdd?.producto?._id)
        console.log('itemIndexInCart => ', itemIndexInCart)


        if (!carrito) {
            const newCarrito = await CarritosRepository.save({userId: userId})
            newCarrito.items.push(itemToAdd)
            const result = await newCarrito.save()
            res.status(200).json(result)   
        } 
        else if ((itemIndexInCart > -1)) {
            console.log("carrito antes de agregar cantidad ", carrito)
            carrito.items[itemIndexInCart].cantidad = carrito.items[itemIndexInCart].cantidad + itemToAdd.cantidad
            console.log("carrito post agregar cantidad ", carrito)
            const result = await carrito.save()

            console.log("result ", result)
  
            res.status(200).json(result)
        }
        else {
            console.log("carrito.items ", carrito.items)
            carrito.items.push(itemToAdd)
            const result = await carrito.save()
            res.status(200).json(result)    
        }

    }





    //     if(carrito) {
    //         console.log("carrito.items ", carrito.items)
    //         carrito.items.push(itemToAdd)
    //         const result = await carrito.save()
    //         res.status(200).json(result)    
    //     }
    //     else {
    //         const newCarrito = await CarritosRepository.save({userId: userId})
    //         newCarrito.items.push(itemToAdd)
    //         const result = await newCarrito.save()
    //         res.status(200).json(result)   
    //     }
    // }
    catch(err) {
        console.log("Error => ", err)
        const error = {error: true, message: err.message}
        res.status(500).json(error)
    }
}

// elimina todos los items al carrito correspondiente al usuario loggeado

const deleteItemsCarrito = async (req, res) => {
    try {
        const userId = req.user._id
        const carrito = await CarritosRepository.getOneByFilter("userId", userId)

        if(carrito) {
            carrito.items.splice(0, carrito.items.length)
            console.log("carrito post splice ", carrito)
            const result = await carrito.save()

            console.log("result ", result)
  
            res.status(200).json(result)
        }
        else {
            const error = {error: true, message: "No existe el carrito"}
            res.status(400).json(error)   
        }
    }
    catch(err) {
        const error = {error: true, message: err.message}
        res.status(500).json(error)
    }
}

// elimina el producto con id indicado del carrito correspondiente al usuario loggeado

const deleteItemCarritoById = async (req, res) => {
    // let itemId = req.params.itemId
    // console.log('req.params.itemId => ', req.params.itemId)    
    
    // try{
    //     itemId = Types.ObjectId(itemId)  
    // }
    // catch(err) {
    //     const error = {error: true, message: "El id indicado no es un tipo válido, probablemente estuvo mal tipeado"}
    //     res.status(404).json(error)
    //     return
    // }

    try {
        const itemId = req.params.itemId
        const userId = req.user._id
        const carrito = await CarritosRepository.getOneByFilter("userId", userId)

        if(carrito) {
            const itemIndex = carrito.items.findIndex(item => item._id.toString() === itemId)
            console.log('itemIndex => ', itemIndex)
            if(itemIndex === -1) {
                const error = {error: true, message: `No existe item con id ${itemId} en el carrito ${carrito._id}`}
                res.status(404).json(error)
                return
            }
            carrito.items.splice(itemIndex, 1)
            console.log("carrito post splice ", carrito)
            const result = await carrito.save()

            console.log("result ", result)
  
            res.status(200).json(result)
        }
        else {
            const error = {error: true, message: "No existe el carrito"}
            res.status(400).json(error)   
        }
    }
    catch(err) {
        const error = {error: true, message: err.message}
        res.status(500).json(error)
    }
}

module.exports = {
    getCarrito,
    // saveCarrito,
    getProductosCarrito,
    saveItemCarrito,
    deleteItemsCarrito,
    deleteItemCarritoById
}





//

// // guarda un nuevo carrito asociado al usuario loggeado
// const saveCarrito = async (req, res) => {
//     try {
//         const userId = req.user._id
//         const result = await CarritosRepository.save({userId: userId, productos: []}) 
    
//         res.status(200).json(result)
//     }
//     catch(err) {
//         const error = {error: true, message: err.message}
//         res.status(500).json(error)
//     }
// }