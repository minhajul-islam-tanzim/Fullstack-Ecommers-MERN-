const express = require('express');
const authRouter = express.Router()
const {register, login, me, logout} = require('../controllers/authController')
const {isAuth} = require("../middlewares/isAuth")

    authRouter.post("/singUp", register)
    authRouter.post("/login", login);
    authRouter.get("/me",isAuth ,me);
    authRouter.post("/logout", logout);

module.exports = authRouter;