const { admin, TOKEN_SECRET_SIGN } = require("../config/config.js");
const jwt = require('jsonwebtoken')



const isAdmin = (req, res, next) => {
    if (!admin) {
        error = new Error(`No tiene autorización de Admin`)
        res.json({error: -1, descripcion:`Ruta ${req.baseUrl}${req.url}, método ${req.method}, no autorizado`})
    }
    else {
        next()
    }
}



const isLogged = (req, res, next) => {
    
    // El token va en Headers: {Authorization: Bearer <JWT>}
    const tokenHeader = req.headers?.authorization;
    console.log("tokenHeader => ", tokenHeader);
    
    if (!tokenHeader) {
        const error = {error: true, authenticated: "false", message: 'No autenticado.', user: req.user||null}
        res.status(401).send(error);
        return
    }

    const token = tokenHeader?.split(" ")[1];
    console.log("token => ", token);

    try {  
        const tokenPayload = jwt.verify(token, TOKEN_SECRET_SIGN);
        console.log("Token payload => ", tokenPayload)
        req.user = tokenPayload.user
        next();
    } catch (err) {
        console.log(err.message);
        const error = {error: true, loged: "false", message: `No autenticado. ${err.message}`, user: req.user||null}
        res.status(401).send(error)
    }
}


module.exports = {isAdmin, isLogged}