const Product = require("../models/productModel");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "fashion-products" },
      (error, result) => {
        if (error) return reject(error);
        resolve(
          {
            url:  result.secure_url,
            public_id: result.public_id

          }

        );
      },
    );
    Readable.from([buffer]).pipe(stream);
  });
};

exports.createProduct = async (req, res) => {
  try {
    
    if (!req.files?.mainImage?.[0]) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    const { name, gender, description, price, category, sizes, colors, stock } =
      req.body;

    // Main image Cloudinary upload
    const mainImage = await uploadToCloudinary(
      req.files.mainImage[0].buffer
    );

    // Additional images upload in cloudinary
    const additionalImages = await Promise.all(
      (req.files.additionalImages || []).map((file) =>
        uploadToCloudinary(file.buffer)
      )
    );

    const product = await Product.create({
      name,
      gender,
      description,
      price,
      category,
      mainImage,
      additionalImages, 
      sizes: sizes ? sizes.split(",") : [],
      colors: colors ? colors.split(",") : [],
      stock: stock || 0,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch product",
    });
  }
};



exports.updateController = async (req, res, next) => {
  console.log("FILES:", req.files);
console.log("BODY:", req.body);
console.log("NEW IMAGE:", req.files?.mainImage?.[0]);

  try{
 const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      gender,
      category,
      description,
      price,
      stock,
      sizes,
      colors,
    } = req.body;

    // Update product fields
    product.name = name ?? product.name;
    product.gender = gender ?? product.gender;
    product.category = category ?? product.category;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;

  product.sizes = sizes
  ? JSON.parse(sizes)
  : product.sizes;

product.colors = colors
  ? JSON.parse(colors)
  : product.colors;
    // Update image if a new image is uploaded

    if (req.files?.mainImage?.[0]) {
      
      const imageBuffer = req.files.mainImage[0].buffer;

        const uploadedImage = await uploadToCloudinary(imageBuffer)

        product.mainImage = {
          url: uploadedImage.url,
          public_id : uploadedImage.public_id,
        }
          console.log("3. Product image updated:", product.mainImage);

      }



    await product.save();
    
    console.log("SAVED PRODUCT:", product.mainImage);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });

} catch(error){
  res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
}
  
};




exports.deleteController = async (req, res) => { 
  try{
    const {id} = req.params;

      const product = await Product.findById(id)

      if(!product){
        return res.status(404).json({
          message: "Product not found",
        })
      }


      if(product.mainImage?.public_id){
        await cloudinary.uploader.destroy(
          product.mainImage.public_id
        );
      }

      for ( const image of product.additionalImages || [] ) {
        if (image.public_id){
          await cloudinary.uploader.destroy(image.public_id)
        }
      }

        await Product.findByIdAndDelete(id)

        return res.status(200).json({
          success: true,
          message: " Product deleted successfuly "

      })
    


  }catch(error){
      res.status(500).json({
      message: "Failed to delete product",
    });

  }

}