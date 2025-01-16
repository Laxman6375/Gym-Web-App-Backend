const Blog = require("../models/Blog");
const Product = require("../models/Product");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


exports.createBlog = async (req, res) => {
    try {
        // Extract data from request body
        const { title, excerpt, content, author, category } = req.body;
        console.log(title, excerpt, content, author,  category);

        // Ensure all required fields are present
        if (!title || !excerpt || !content || !author  || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields marked with * are required",
            });
        }

        // Check if an image is uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Blog image is required",
            });
        }

        // Get the image buffer from the request and upload to Cloudinary
        const blogPicture = req.file.buffer;
        const blogImage = await uploadImageToCloudinary(
            blogPicture,
            process.env.FOLDER_NAME,
            1000, // You can adjust these dimensions
            1000
        );

        // Create a new blog entry using the updated schema
        const blog = new Blog({
            title,
            imageUrl: blogImage.secure_url, // Store the image URL from Cloudinary
            excerpt,
            content,
            author,
            category,
        });

        // Save the blog entry to the database
        await blog.save();

        return res.status(200).json({
            success: true,
            message: "Blog created successfully",
        });
    } catch (error) {
        // Handle any errors
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error creating blog",
            error,
        });
    }
}

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()

        return res.status(200).json({
            success: true,
            blogs,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internel error",
            error,
        })
    }
}

exports.getBlog = async (req, res) => {
    try {
        const {id} = req.params
        const blog = await Blog.findById(id)
        if(!blog){
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        return res.status(200).json({
            success: true,
            blog,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internel error",
        })
    }
}

exports.deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal error",
            error,
        });
    }
}