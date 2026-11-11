const express = require("express");
const productRouter = express.Router();



const {createProduct, getAllProducts, getProductById, deleteProduct } = require("../controllers/productController")
const upload = require('../middlewares/upload')
const isAuth = require("../middlewares/isAuth")
const isAdmin = require("../middlewares/isAdmin")


productRouter.post("/", isAuth, isAdmin,  upload.single("image"), createProduct)
productRouter.get("/", getAllProducts)
productRouter.get("/:id", getProductById)
productRouter.delete("/:id",isAuth, isAdmin,deleteProduct)

module.exports = productRouter;