const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Category name is required"],
            trim: true,
            unique: true,
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
            trim: true,
            default: "",
        },

        image: {
            type: String,
            default: null,
        },

        // status: {
        //     type: String,
        //     enum: ["active", "inactive"],
        //     default: "active",
        // },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Category = model("Category", categorySchema);

module.exports = Category;
