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
    const { name, gender, description, price, category, sizes, colors, stock } =
      req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }


const mainImage = await uploadToCloudinary(
  req.files.mainImage[0].buffer
);

const additionalImage = await Promise.all(
  (req.files.additionalImages || []).map((file) => uploadToCloudinary(file.buffer))
)

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

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};





exports.updateController = async (req, res, next) => {


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
      ? sizes.split(",").map((size) => size.trim()).filter(Boolean)
      : product.sizes;

    product.colors = colors
      ? colors.split(",").map((color) => color.trim()).filter(Boolean)
      : product.colors;

    // Update image if a new image is uploaded
    if (req.file) {
      product.image = req.file.path;
    }

    await product.save();

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
