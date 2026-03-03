const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "tmp/");
  },

  filename: (req, file, cb) => {
    const name = Date.now() + file.originalname.split(".")[0];
    cb(null, name);
  },
});

module.exports = multer({ storage: storage });
