const express = require('express');
const authRouter = express.Router()
const {register, login} = require('../controllers/authController')

    authRouter.post("/singUp", register)
    authRouter.post("/login", login);
    authRouter.post("/logout", logout);

module.exports = authRouter;