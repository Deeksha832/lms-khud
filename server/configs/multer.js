// import multer from "multer";

// const storage = multer.diskStorage({})

// const upload = multer({ storage })

// export default upload

import multer from 'multer';

// Use memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

export default upload;
