const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },
      imageUrl: {
        type: String,
        required: true,
      },
      excerpt: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      author: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
    },
    {
      timestamps: true,
    }
  );
  
  blogSchema.pre('remove', function (next) {
    console.log(`Blog titled "${this.title}" is being deleted.`);
    next();
  });
  

module.exports = mongoose.model('BLOG', blogSchema);
