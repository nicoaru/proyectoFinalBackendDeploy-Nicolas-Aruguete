const {connectServer} = require('./server.js')
const {PORT, NODE_ENV} = require('./config/config.js')


console.log("NODE_ENV ", NODE_ENV)
//CONNECT SERVER
const server = connectServer(PORT)

//SOCKET SERVER
require('./socket.js')






