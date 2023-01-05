const { createHash, validateEmail, compareHash } = require('../../utils/utils.js')
const { UsersRepository } = require('../../model/repositories/users.repository.js')
const { CarritosRepository } = require('../../model/repositories/carritos.repository.js')
const {sendMail} = require('../nodeMailer.js')
const {ADMIN_EMAIL, TOKEN_SECRET_SIGN, TOKEN_EXP_TIME} = require('../../config/config.js')
const mongoose = require('mongoose')
const Types = mongoose.Types
const jwt = require('jsonwebtoken')



const createUser = async (req, res) => {
    console.log("Entró en POST /signup")
    try {
        let usernameNotAvailable = await UsersRepository.getOneByFilter('username', req.body.username)
        let emailAlreadyRegistered = await UsersRepository.getOneByFilter('email', req.body.email)
        console.log("body ", req.body)
        console.log("usernameNotAvailable ", usernameNotAvailable)
        console.log("emailAlreadyRegistered ", emailAlreadyRegistered)

        if(!req.body.username || !req.body.email || !req.body.password || !validateEmail(req.body.email)) {
            console.log(`failed signup => `, 'Usuario, Email válido y Contraseña son obligatorios')
            res.status(400).json({error: true, message: 'Usuario, Email válido y Contraseña son obligatorios'})
        }
        else if (usernameNotAvailable || emailAlreadyRegistered) {
            let resp
            emailAlreadyRegistered
                ? resp = {error: true, message: "Ya hay un usuario registrado con ese email"}            
                : resp = {error: true, message: "Nombre de usuario no está disponible"}


            res.status(400).json(resp)
        }
        else {
            _newUser = {
                username: req.body.username, 
                name: req.body.name,
                password: createHash(req.body.password),
                email: req.body.email, 
                telephone: req.body.telephone, 
                address: req.body.address,
                imgurl: req.body.imgurl
            }
            UsersRepository.save(_newUser)
            .then(async user => {
                console.log(`usuario creado => `, user)
                
                try {
                    await CarritosRepository.save({userId: user._id})                    
                }
                catch(err) {
                    console.log("/api/users/signup . no pudo crear el carrito correspondiente al nuevo usuario => ", err.message)
                }

                const emailSubject = "Nuevo resgitro"
                const emailHtmlBody = `<h3>Nombre: ${user.name}</h3>
                                        <h3>Usuario: ${user.username}</h3>
                                        <h3>Email: ${user.email}</h3>
                                        <h3>Teléfono: ${user.telephone}</h3>
                                        <h3>Dirección: ${user.address}</h3>
                                        <h3>Avatar: <img src="${user.imgurl}" alt="imagen de usuario" width="100px"/> </h3>`
                const adminEmailResult = await sendMail(emailSubject, emailHtmlBody, ADMIN_EMAIL)
                console.log("Signup admin notification result ", adminEmailResult)
                
                res.status(200).json(user)
            })
            .catch(error => {
                console.log('error _newUser.save( )=> ', error)
                throw error
            })
        }
    }
    catch(error) {
        console.log(`Error signup => `, error)
        res.status(500).json({error: true, message: error.message})
    }
}



const loginJWT = async (req, res) => {
    console.log("Entró en passport loginJWT")
    try {
        const username = req.body.username
        const password =  req.body.password
        console.log(`/api/users/login . username: ${username}, password: ${password}`)
        
        const user = await UsersRepository.getOneByFilter('username', username)
        console.log("line 15 . _user => ", user)
        // no autenticado
        if (!user || !(compareHash(password, user.password))){
            console.log(`No autenticado`)
            const error = {error: true, loged: "false", message: 'No autenticado. Usuario o contraseña incorrectos.', user: req.user||null}
            res.status(401).json(error)
        }
        // autenticado
        else {
            const userToReturn = user.toJSON()
            delete userToReturn.password
            console.log("/api/users/login . Autenticado => ", userToReturn)

            const token = jwt.sign({user: userToReturn}, TOKEN_SECRET_SIGN, {expiresIn: TOKEN_EXP_TIME})
            res.status(200).json({user: userToReturn, token})
        }
    }
    // error
    catch(err) {
        console.log(`/api/users/login . Error autenticando => ${err.message}`)
        const error = {error: true, loged: "false", message:  `No autenticado. ${err.message}`, user: req.user}
        res.status(500).json(error)
    }  
}



const deleteUserById = async (req, res) => {
    console.log("Entró en DELETE 'api/users/:userId'")
    let userId = req.params.userId   
    try{
        userId = Types.ObjectId(userId)  
    }
    catch(err) {
        const error = {error: true, message: err.message}
        res.status(400).json(error)
        return
    }
    try {
        const result = await UsersRepository.deleteById(userId)
        try {
            await CarritosRepository.deleteByFilter('userId', userId)                   
        }
        catch(err) {
            console.log("/api/users/signup . no pudo borrar el carrito correspondiente al usuario eliminado => ", err.message)
        }
       
        res.status(200).json(result)
    }        
    catch(err) {
        const error = {error: true, message: err.message}
        res.status(500).json(error)
    }


}

module.exports = { createUser, deleteUserById, loginJWT }