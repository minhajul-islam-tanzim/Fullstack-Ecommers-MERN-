const Product = require("../models/productModel");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream( 
      { folder: "fashion-products" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      },
    );
    Readable.from(buffer).pipe(stream);
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

    const imageUrl = await uploadToCloudinary(req.file.buffer);

    const product = await Product.create({
      name,
      gender,
      description,
      price,
      category,
      image: imageUrl,
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