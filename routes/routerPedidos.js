const { Router } = require("express")
const {isLogged} = require('../utils/middlewares.js')
const {savePedido, getPedidos, getPedidoById} = require('../service/cotrollers/controllerPedidos.js')

const routerPedidos = Router()


// crea un pedido nuevo
routerPedidos.post("/", isLogged, savePedido)

// devuelve todos los pedidos del usuario
routerPedidos.get("/", isLogged, getPedidos)

// devuelvo un pedido por id, sólo si corresponde al usuario logeado
routerPedidos.get("/:idPedido", isLogged, getPedidoById)






module.exports = {routerPedidos}
