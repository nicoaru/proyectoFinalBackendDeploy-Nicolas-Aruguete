const dotenv = require('dotenv')
dotenv.config()



// Node_env
const NODE_ENV = process.env.NODE_ENV || 'dev'

// Server
const PORT = process.env.PORT || 8080

// MongoDB URI
const MONGODB_URISTRING = NODE_ENV === 'prod'
    ? process.env.PROD_MONGODB_URISTRING
    : process.env.DEV_MONGODB_URISTRING

// Base de datos
const DB_TYPE = process.env.DB_TYPE

// JsonWebToken config
const TOKEN_SECRET_SIGN = NODE_ENV === 'prod'
    ? process.env.PROD_TOKEN_SECRET_SIGN
    : process.env.DEV_TOKEN_SECRET_SIGN

let TOKEN_EXP_TIME
try {
    TOKEN_EXP_TIME = eval(process.env.TOKEN_EXP_TIME)
} 
catch(err){
    TOKEN_EXP_TIME = process.env.TOKEN_EXP_TIME
}

// Nodemailer config with Gmail
const SERVER_EMAIL_ADDRESS = process.env.MY_EMAIL_ADDRESS
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD

// Admin email
const ADMIN_EMAIL = NODE_ENV === 'prod'
    ? process.env.PROD_ADMIN_EMAIL
    : process.env.DEV_ADMIN_EMAIL

module.exports = {
    DB_TYPE,
    MONGODB_URISTRING, 
    TOKEN_SECRET_SIGN,
    TOKEN_EXP_TIME,
    SERVER_EMAIL_ADDRESS,
    GMAIL_PASSWORD,
    ADMIN_EMAIL,
    PORT, 
    NODE_ENV
}