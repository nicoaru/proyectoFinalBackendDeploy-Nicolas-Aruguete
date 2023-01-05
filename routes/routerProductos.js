const { ProductosDAO} = require("../model/daos/daos.js")
const { Router } = require("express")
const {isLogged} = require('../utils/middlewares.js')
const routerProductos = Router()
const {getProducts, getProductById, getProductsByCategory, saveProducts, updateProductById, deleteProducts, deleteProductById} = require('../service/cotrollers/controllerProductos.js')



// devuelve todos los productos
routerProductos.get("/", isLogged, getProducts)

// devuelve error pidiendo que indiques una categoría
routerProductos.get("/categorias", isLogged, getProductsByCategory)

// devuelve todos los productos con la categoría indicada
routerProductos.get("/categorias/:categoria", isLogged, getProductsByCategory)

// devuelve el producto con el id indicado
routerProductos.get("/:id", isLogged, getProductById)

// carga uno o varios nuevos productos
routerProductos.post("/", isLogged, saveProducts)

// actualiza el producto con el id indicado
routerProductos.put("/:id", isLogged, updateProductById)

// elimina todos los productos
routerProductos.delete("/", isLogged, deleteProducts)

// elimina el producto con el id indicado
routerProductos.delete("/:id", isLogged, deleteProductById)



module.exports = {routerProductos}
