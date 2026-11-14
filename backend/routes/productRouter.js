const express = require("express");
const productRouter = express.Router();



const {createProduct, getAllProducts, getProductById, deleteProduct, updateController } = require("../controllers/productController")
const upload = require('../middlewares/upload')
const isAuth = require("../middlewares/isAuth")
const isAdmin = require("../middlewares/isAdmin")


productRouter.post("/", isAuth, isAdmin,

    upload.fields([
        {name: "mainImage", maxCount: 1},
        { name: "additionalImages", maxCount: 3 }
    ]),
      
      createProduct)

      
productRouter.get("/", getAllProducts)
productRouter.get("/:id", getProductById)
productRouter.delete("/:id",isAuth, isAdmin,deleteProduct)


productRouter.put("/:id", isAuth, isAdmin, 

  upload.fields([
    { name: "mainImage", maxCount: 1 }, 
    { name: "additionalImages", maxCount: 3 }, 
  ]),

updateController)

module.exports = productRouter;