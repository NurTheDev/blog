const blogModel = require("../models/blog.model");
const validation = require("../helpers/validation");
const userModel = require("../models/user.model");
const fs = require("fs");
/**
 * Create a new blog
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.createBlog = async (req, res) => {
    const {title, content, user} = req.body;
    const thumbnail = req.file.filename
    console.log(req.file)
    const validationResponse = validation(req);
    if (!validationResponse.status) return res.status(400).json({message: validationResponse.message})
    try {
        const blog = await blogModel.create({
            title,
            content,
            thumbnail: `${req.protocol}://${req.get('host')}/images/${thumbnail.trim()}`,
            user
        })
        if (!blog) return res.status(400).json({message: "Error creating blog"})
        await userModel.findByIdAndUpdate(user, {$push: {blogs: blog._id}})
        res.status(201).json({message: "Blog created successfully", blog})
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({message: "Error creating blog"});
    }
}

/**
 * Get all blogs
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await blogModel.find()
        if (!blogs) return res.status(400).json({message: "No blogs found"})
        res.status(200).json({message: "Blogs found successfully", blogs})
    } catch (error) {
        console.error("Error getting all blogs:", error);
        res.status(500).json({message: "Error getting all blogs"});
    }
}
/**
 * Get all blogs by user id
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.getBlogsByUser = async (req, res) => {
    const {id} = req.params
    try {
        if (!id) return res.status(400).json({message: "User id is required"})
        const user = await userModel.findById(id)
        if (!user) return res.status(400).json({message: "User not found"})
        const blogs = await blogModel.find({user: id})
        if (!blogs) return res.status(400).json({message: "No blogs found"})
        res.status(200).json({message: "Blogs found successfully", blogs})
    } catch (error) {
        console.error("Error getting all blogs:", error);
        res.status(500).json({message: "Error getting all blogs"});
    }
}
/**
 * Update a blog
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.updateBlog = async (req, res) => {
    console.log("working")
    const {id} = req.params
    const validationResponse = validation(req);
    if (!validationResponse.status) return res.status(400).json({message: validationResponse.message})
    try {
        const {title, content} = req.body
        const updatedData = {title, content}
        let oldThumbnail = null
        if (req.file) {
            const thumbnail = req.file.filename
            const oldBlog = await blogModel.findById(id)
            if (oldBlog && oldBlog.thumbnail) {
                oldThumbnail = `public/temp/${oldBlog.thumbnail.split("/").pop()}`
                updatedData.thumbnail = `${req.protocol}://${req.get('host')}/images/${thumbnail.trim()}`
            }
        }
        const blog = await blogModel.findByIdAndUpdate({_id: id}, {$set: updatedData}, {new: true})
        if(!blog) return res.status(400).json({message: "Blog not found"})
        if(oldThumbnail){
            fs.unlink(oldThumbnail, (err)=>{
                if(err) console.error("Error deleting old thumbnail:", err)
                res.status(200).json({message: "Blog updated successfully", blog})
            })
        }
        res.status(200).json({message: "Blog updated successfully", blog})
    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({message: "Error updating blog"});
    }
}

exports.deleteBlog = async (req, res)=>{
    const {id} = req.params
    try{
        const blog = await blogModel.findByIdAndDelete({_id: id})
        if(!blog) return res.status(400).json({message: "Blog not found"})
        res.status(200).json({message: "Blog deleted successfully"})
    }catch (error){
        console.error("Error deleting blog:", error);
        res.status(500).json({message: "Error deleting blog"});
    }
}
exports.getBlogById = async(req, res)=>{
    const {id} = req.params
    console.log(id)
    try{
        const blog = await blogModel.findById(id)
        if(!blog) return res.status(400).json({message: "Blog not found"})
        res.status(200).json({message: "Blog found successfully", blog})
    }catch (error){
        console.error("Error getting blog:", error);
        res.status(500).json({message: "Error getting blog"});
    }
}
