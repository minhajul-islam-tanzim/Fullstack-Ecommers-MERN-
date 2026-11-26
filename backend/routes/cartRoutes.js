const express = require("express")
const router = express.Router();


const {addToCart} = require("../controllers/cartController")
const auth = require("../middlewares/isAuth")


router.post("/", auth, addToCart);

module.exports = router;