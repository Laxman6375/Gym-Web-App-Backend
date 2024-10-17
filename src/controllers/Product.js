const Product = require("../models/Product");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createProduct = async (req, res) => {
    try {
        const { name, price, description,category,quantity } = req.body;

        if (!name || !price ||!description) {
            return res.status(400).json({
                success: false,
                message: "All fields marked with * are required",
            });
        }

        const productPicture = req.file.buffer;
        const productImage = await uploadImageToCloudinary(
          productPicture,
          process.env.FOLDER_NAME,
          1000,
          1000
        );

        

        const product = new Product({
            name,
            price,
            description,
            category,
            image:productImage.secure_url ,
            quantity,
        });

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product created successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating product",
            error,
        })
    }
}

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find()

        return res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internel error",
            error,
        })
    }
}

exports.getProduct = async (req, res) => {
    try {
        const {id} = req.params
        const product = await Product.findById(id)
        if(!product){
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internel error",
        })
    }
}