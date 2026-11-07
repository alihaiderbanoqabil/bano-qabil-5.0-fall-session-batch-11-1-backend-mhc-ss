const { Schema, model } = require("mongoose");

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        discountPrice: {
            type: Number,
            default: null,
            min: 0,
        },

        stock: {
            type: Number,
            default: 0,
            min: 0,
        },

        images: [
            {
                type: String,
            },
        ],

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        status: {
            type: String,
            enum: ["active", "inactive", "out_of_stock"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

const Product = model("Product", productSchema);

module.exports = Product;
