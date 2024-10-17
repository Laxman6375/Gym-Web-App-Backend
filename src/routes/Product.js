const express = require("express");
const router = express.Router();
const {createProduct, getProducts, getProduct} = require("../controllers/Product");
const upload = require("../config/multer");

//Auth routes
router.post("/create",upload.single('image'),(req, res, next) => {
    try {
        next();
    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ success: false, message: 'Error uploading image' });
    }
},createProduct)
.get("/allProducts",getProducts)
.get("/:id",getProduct)

module.exports = router;
