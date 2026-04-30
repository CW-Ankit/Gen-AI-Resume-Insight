import multer from "multer";

export const upload = multer({
    storage: multer.memoryStorage(),
    limits:{
        fileSize: 3*1024*1024  // max file size: 3MB
    }
})