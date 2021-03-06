var express = require("express");
var router = express.Router();

var item_controller = require("../controllers/itemController");
var manufacturer_controller = require("../controllers/manufacturerController");
var made_in_controller = require("../controllers/made_inController");
var category_controller = require("../controllers/categoryController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// GET home page
router.get("/", item_controller.index);

// Item Routes

router.get("/item/create", item_controller.item_create_get);
router.post(
  "/item/create",
  upload.single("image_url"),
  item_controller.item_create_post
);
router.get("/item/:id/delete", item_controller.item_delete_get);
router.post("/item/:id/delete", item_controller.item_delete_post);
router.get("/item/:id/update", item_controller.item_update_get);
router.post("/item/:id/update", item_controller.item_update_post);
router.get("/item/:id", item_controller.item_detail);
router.get("/items", item_controller.item_list);
router.get("/item/:id/update_image", item_controller.item_update_image_get);
router.post(
  "/item/:id/update_image",
  upload.single("image_url"),
  item_controller.item_update_image_post
);

// Manufacturer Routes

router.get(
  "/manufacturer/create",
  manufacturer_controller.manufacturer_create_get
);
router.post(
  "/manufacturer/create",
  upload.single("image_url"),
  manufacturer_controller.manufacturer_create_post
);
router.get(
  "/manufacturer/:id/delete",
  manufacturer_controller.manufacturer_delete_get
);
router.post(
  "/manufacturer/:id/delete",
  manufacturer_controller.manufacturer_delete_post
);
router.get(
  "/manufacturer/:id/update",
  manufacturer_controller.manufacturer_update_get
);
router.post(
  "/manufacturer/:id/update",
  manufacturer_controller.manufacturer_update_post
);
router.get("/manufacturer/:id", manufacturer_controller.manufacturer_detail);
router.get("/manufacturers", manufacturer_controller.manufacturer_list);
router.get(
  "/manufacturer/:id/update_image",
  manufacturer_controller.manufacturer_update_image_get
);
router.post(
  "/manufacturer/:id/update_image",
  upload.single("image_url"),
  manufacturer_controller.manufacturer_update_image_post
);

// Made In Routes

router.get("/made_in/create", made_in_controller.made_in_create_get);
router.post(
  "/made_in/create",
  upload.single("image_url"),
  made_in_controller.made_in_create_post
);
router.get("/made_in/:id/delete", made_in_controller.made_in_delete_get);
router.post("/made_in/:id/delete", made_in_controller.made_in_delete_post);
router.get("/made_in/:id/update", made_in_controller.made_in_update_get);
router.post("/made_in/:id/update", made_in_controller.made_in_update_post);
router.get("/made_in/:id", made_in_controller.made_in_detail);
router.get("/made_ins", made_in_controller.made_in_list);
router.get(
  "/made_in/:id/update_image",
  made_in_controller.made_in_update_image_get
);
router.post(
  "/made_in/:id/update_image",
  upload.single("image_url"),
  made_in_controller.made_in_update_image_post
);

// Category Routes

router.get("/category/create", category_controller.category_create_get);
router.post("/category/create", category_controller.category_create_post);
router.get("/category/:id/delete", category_controller.category_delete_get);
router.post("/category/:id/delete", category_controller.category_delete_post);
router.get("/category/:id/update", category_controller.category_update_get);
router.post("/category/:id/update", category_controller.category_update_post);
router.get("/category/:id", category_controller.category_detail);
router.get("/categories", category_controller.category_list);

module.exports = router;
