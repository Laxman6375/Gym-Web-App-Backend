const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const productSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true,
        enum: ['Equipment', 'Accessories', 'Supplements']  
    },
    image: { 
        type: String 
    },
    quantity: { 
        type: Number, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now() 
    },
    updatedAt: { 
        type: Date 
    }
})

module.exports = mongoose.model('Product', productSchema);