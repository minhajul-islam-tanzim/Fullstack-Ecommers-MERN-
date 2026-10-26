const express = require('express');
const authRouter = express.Router()
const {register, login} = require('../controllers/authController')

    authRouter.post("/singUp", register)
    authRouter.post("/login", login);
    
module.exports = authRouter;