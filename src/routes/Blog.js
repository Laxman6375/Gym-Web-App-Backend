const express = require("express");
const router = express.Router();
const {createBlog, getBlogs, getBlog} = require("../controllers/Blog");
const upload = require("../config/multer");

//Auth routes
router.post("/create",upload.single('image'),(req, res, next) => {
    try {
        next();
    } catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ success: false, message: 'Error uploading image' });
    }
},createBlog)
.get("/allBlogs",getBlogs)
.get("/:id",getBlog)

module.exports = router;
