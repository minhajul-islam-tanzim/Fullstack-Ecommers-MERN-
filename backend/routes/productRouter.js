const express = require("express");
const productRouter = express.Router();



const {createProduct, getAllProducts } = require("../controllers/productController")
const upload = require('../middlewares/upload')
const isAuth = require("../middlewares/isAuth")
const isAdmin = require("../middlewares/isAdmin")


productRouter.post("/", isAuth, isAdmin,  upload.single("image"), createProduct)
productRouter.get("/", getAllProducts)

module.exports = productRouter;