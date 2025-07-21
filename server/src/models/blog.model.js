const mongoose = require("mongoose");
const {Schema} = mongoose;

const blogSchema = new Schema({
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
            required: false
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        versionKey: false,
        timestamps: true
    })
const blogModel = mongoose.model("blog", blogSchema);
module.exports = blogModel
