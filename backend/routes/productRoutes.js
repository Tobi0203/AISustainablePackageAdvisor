const router = require("express").Router();
const { body, param } = require("express-validator");
const validate = require("../middleware/validateMiddleware");
const controller = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");

const productValidation = [
  body("name").trim().notEmpty().isLength({ max: 200 }).withMessage("Product name is required."),
  body("description").trim().notEmpty().isLength({ max: 3000 }).withMessage("Product description is required."),
  body("category").isIn(["boxes", "mailers", "bags", "bottles", "containers", "wraps", "labels", "protective", "other"]).withMessage("Choose a valid product category."),
  body("material").trim().notEmpty().withMessage("Material is required."),
  body("price").isFloat({ min: 0 }).withMessage("Price must be zero or greater."),
  body("minimumOrderQuantity").isInt({ min: 1 }).withMessage("Minimum order quantity must be at least one."),
];

// Static paths must be registered before the dynamic /:id path.
router.get("/mine", protect, authorize("supplier"), controller.getMyProducts);
router.get("/", controller.getProducts);
router.post("/", protect, authorize("supplier"), productValidation, validate, controller.createProduct);
router.get("/:id", [param("id").isMongoId().withMessage("Invalid product ID.")], validate, controller.getProduct);
router.patch("/:id", protect, authorize("supplier", "admin"), [param("id").isMongoId().withMessage("Invalid product ID.")], validate, controller.updateProduct);
router.delete("/:id", protect, authorize("supplier", "admin"), [param("id").isMongoId().withMessage("Invalid product ID.")], validate, controller.deleteProduct);

module.exports = router;
