const Cart = require("../models/cartModel")

exports.addToCart = async(req, res) => {
    try{

        const {  productId, quantity, size, color } = req.body;

        let cart = await Cart.findOne({
            userId : req.userId,
        })

        if(!cart){
            cart = new Cart({
                userId: req.userId,
                items: []
            })

        }

        const existingItem = cart.items.find(
            (item) => item.productId.toString() === productId && 
            item.size === size &&
            item.color === color
        );

        if(existingItem){
            existingItem.quantity += quantity || 1;
        }else{
            cart.items.push({
                productId,
                quantity: quantity || 1,
                size, 
                color    
            })
        }

        await cart.save();

        res.status(200).json({
            success: true ,
            message: "product added to cart",
            cart,
        })
        
    }catch(error){ console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
}