const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const path = "./public/temp";
        cb(null, path)
    },
    filename: function (req, file, cb) {
        const name = Date.now() + "-" + file.originalname.trim();
        cb(null, name)
    }
})
exports.upload = multer({
    storage: storage, limit: {
        fileSize: 1024 * 1024 * 5
    }
})
