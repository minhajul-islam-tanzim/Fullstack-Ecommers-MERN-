const express = require("express");
const productRouter = express.Router();



const {createProduct} = require("../controllers/productController")
const upload = require('../middlewares/upload')
const isAuth = require("../middlewares/isAuth")
const isAdmin = require("../middlewares/isAdmin")


productRouter.post("/", isAuth, isAdmin,  upload.single("image"), createProduct)

module.exports = productRouter;