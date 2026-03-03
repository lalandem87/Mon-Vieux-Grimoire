const express = require("express");
const controller = require("../controllers/book.controller");
const requireLogin = require("../middleware/auth.middleware");
const router = express.Router();
const upload = require("../middleware/multer.middleware");

router.get("/", controller.getAllBooks);
router.get("/bestrating", controller.getBestRating);
router.get("/:id", controller.getBooksById);
router.post("/", requireLogin, upload.single("image"), controller.createBooks);
router.post("/:id/rating", requireLogin, controller.giveRating);
router.put("/:id", requireLogin, upload.single("image"), controller.editBooks);
router.delete("/:id", requireLogin, controller.removeBooks);

module.exports = router;
