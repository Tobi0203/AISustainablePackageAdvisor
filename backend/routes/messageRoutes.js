const router = require("express").Router();
const { body, param } = require("express-validator");
const validate = require("../middleware/validateMiddleware");
const { protect } = require("../middleware/authMiddleware");
const controller = require("../controllers/messageController");

router.use(protect);
router.get("/:quoteId/messages", [param("quoteId").isMongoId()], validate, controller.getMessages);
router.post("/:quoteId/messages", [param("quoteId").isMongoId(), body("body").trim().isLength({ min: 1, max: 2000 }).withMessage("Message must be between 1 and 2000 characters.")], validate, controller.createMessage);
module.exports = router;
