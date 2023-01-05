const express = require("express")
const compression = require('compression')
const gzipMiddleware = compression()
const {Server: HTTPServer} = require("http")
// const {Server: SocketServer} = require("socket.io")

const {routerProductos} = require('./routes/routerProductos.js')
const {routerCarritos} = require('./routes/routerCarritos.js')
const {routerPedidos} = require('./routes/routerPedidos.js')
const {routerUsers} = require('./routes/routerUsers.js')
const {routerFake} = require('./routes/routerFake.js')
const {routerInfo} = require('./routes/routerInfo.js')
const session = require('express-session')
const MongoStore = require('connect-mongo') //conecta express-session a mongoDB
const {MONGODB_URISTRING} = require('./config/config.js')
const passport = require('passport');
var cors = require('cors')
const {logger, logEndpoint} = require("./profilling/logger_config.js");


let serverActualPort
let serverActualHost

//EXPRESS
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use('/static', express.static('public'))
// session
app.use(session({
    secret: 'STRING_SECRETA',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: MONGODB_URISTRING,
      retries: 0,
      ttl: 60 * 10, // 10 minutos
    }),
  })
);
// some middlewares
app.use(cors())
app.use(logEndpoint)
app.use(gzipMiddleware)
// passport
app.use(passport.initialize())
app.use(passport.session())
// routes
app.use("/api/productos", routerProductos)
app.use("/api/carritos", routerCarritos)
app.use("/api/pedidos", routerPedidos)
app.use("/api/users", routerUsers)
app.use("/fake", routerFake)
app.use("/info", routerInfo)

app.get('/', (req, res) => {
    res.json({'message': 'Bienvienido'});
  })


// ruta no existente
app.use(function(req, res, next) {
    logger.warn(`Ruta ${req.url} - método ${req.method} - no existe`)
    res.status(400).json({error: true, message: `Ruta ${req.baseUrl}${req.url}, método ${req.method}, no existe`});
    next();
});



// INSTANCIA DE HTTP.SERVER PASANDOLE EL OBJETO APP COMO PARAMETRO
// const httpServer = new HTTPServer(app)

// INSTANCIA DE SERVER SOCKET.IO PASANDOLE LA INSTANCIA DE HTTP.SERVER COMO PARAMETRO
// const socketServer = new SocketServer(httpServer) 


// FUNCIÓN CONECTAR SERVIDOR
function connectServer (port) {
    const server = app.listen(port, () => {
        serverActualHost = server.address().address
        serverActualPort = server.address().port
        console.log(`Servidor escuchando en puerto ${server.address().port}. Proceso ${process.pid}`)
    })
    .on("error", error => console.log(`Error conectando al servidor => ${error.message}`))
    
    return server
}



module.exports = {
    connectServer, 
    // socketServer
}











