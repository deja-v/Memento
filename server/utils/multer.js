import multer from "multer";

/**
 * Multer configuration using in-memory storage.
 * This avoids disk I/O and ENOENT errors in ephemeral environments like Render.
 */
const storage = multer.memoryStorage();

/**
 * File filter to accept only image MIME types.
 */
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

/**
 * Multer middleware for handling single image uploads.
 */
const upload = multer({ storage, fileFilter });

export default upload;
