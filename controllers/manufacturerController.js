// manufacturerController.js

const Item = require("../models/item");
var Manufacturer = require("../models/manufacturer");
const async = require("async");
const { body, validationResult } = require("express-validator");
const { uploadFile, deleteFile } = require("../utils/cloudinary");

exports.manufacturer_list = function (req, res, next) {
  Manufacturer.find({}, "name description established image_url")
    .sort({ name: 1 })
    .exec(function (err, list_manufacturers) {
      if (err) {
        return next(err);
      }
      res.render("manufacturer/manufacturer-list", {
        title: "Manufacturers",
        manufacturer_list: list_manufacturers,
      });
    });
};

exports.manufacturer_detail = function (req, res, next) {
  async.parallel(
    {
      manufacturer: function (callback) {
        Manufacturer.findById(req.params.id)
          .populate("description")
          .populate("established")
          .populate("image_url")
          .exec(callback);
      },
      manufacturers_items: function (callback) {
        Item.find({ manufacturer: req.params.id }, "item summary")
          .populate("name")
          .populate("image_url")
          .populate("manufacturer")
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.manufacturer == null) {
        let err = new Error("Manufacturer not found.");
        err.status = 404;
        return next(err);
      }
      res.render("manufacturer/manufacturer-detail", {
        title: "Manufacturer Detail",
        manufacturer: results.manufacturer,
        manufacturer_items: results.manufacturers_items,
      });
    }
  );
};

exports.manufacturer_create_get = function (req, res) {
  res.render("manufacturer/manufacturer-form-create", {
    title: "Create Manufacturer",
  });
};

exports.manufacturer_create_post = [
  body("name", "Manufacturer name required.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description required.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("established", "Year established required.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  async (req, res, next) => {
    const errors = validationResult(req);

    // upload image to Cloudinary
    let img = await uploadFile(req.file, "manufacturers");

    let manufacturer = new Manufacturer({
      name: req.body.name,
      description: req.body.description,
      established: req.body.established,
      image_url: img.url,
      cloudinary_id: img.public_id,
    });

    if (!errors.isEmpty()) {
      res.render("manufacturer/manufacturer-form-create", {
        title: "Create Manufacturer",
        manufacturer: manufacturer,
        errors: errors.array(),
      });
      return;
    } else {
      Manufacturer.findOne({ name: req.body.name }).exec(function (
        err,
        found_manufacturer
      ) {
        if (err) {
          return next(err);
        }
        if (found_manufacturer) {
          res.redirect(found_manufacturer.url);
        } else {
          manufacturer.save(function (err) {
            if (err) {
              return next(err);
            }
            res.redirect(manufacturer.url);
          });
        }
      });
    }
  },
];

exports.manufacturer_delete_get = function (req, res) {
  async.parallel(
    {
      manufacturer: function (callback) {
        Manufacturer.findById(req.params.id).exec(callback);
      },
      manufacturers_items: function (callback) {
        Item.find({ manufacturer: req.params.id })
          .populate("manufacturer")
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.manufacturer == null) {
        res.redirect("/manufacturers");
      }
      res.render("manufacturer/manufacturer-delete", {
        title: "Delete Manufacturer",
        manufacturer: results.manufacturer,
        manufacturer_items: results.manufacturers_items,
      });
    }
  );
};
exports.manufacturer_delete_post = function (req, res, next) {
  async.parallel(
    {
      manufacturer: function (callback) {
        Manufacturer.findById(req.body.manufacturerid).exec(callback);
      },
      manufacturers_items: function (callback) {
        Item.find({ manufacturer: req.body.manufacturerid }).exec(callback);
      },
    },
    async function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.manufacturers_items.length > 0) {
        res.render("manufacturer/manufacturer-delete", {
          title: "Delete Manufacturer",
          manufacturer: results.manufacturer,
          manufacturer_items: results.manufacturers_items,
        });
        return;
      } else {
        await deleteFile(results.manufacturer.cloudinary_id);
        Manufacturer.findByIdAndRemove(
          req.body.manufacturerid,
          function deleteManufacturer(err) {
            if (err) {
              return next(err);
            }
            res.redirect("/manufacturers");
          }
        );
      }
    }
  );
};

exports.manufacturer_update_get = function (req, res, next) {
  Manufacturer.findById(req.params.id)
    .populate("name")
    .populate("description")
    .populate("established")
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("manufacturer/manufacturer-form-update", {
        title: "Update Manufacturer",
        manufacturer: results,
      });
    });
};

exports.manufacturer_update_post = [
  // body("name", "Manufacturer name required.")
  //   .trim()
  //   .isLength({ min: 1 })
  //   .escape(),
  // body("description", "Description required.")
  //   .trim()
  //   .isLength({ min: 1 })
  //   .escape(),
  // body("established", "Year established required.")
  //   .trim()
  //   .isLength({ min: 1 })
  //   .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    let manufacturer = new Manufacturer({
      name: req.body.name,
      description: req.body.description,
      established: req.body.established,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("manufacturer/manufacturer-form-update", {
        title: "Update Manufacturer",
        manufacturer: manufacturer,
        errors: errors.array(),
      });
      return;
    } else {
      Manufacturer.findByIdAndUpdate(
        req.params.id,
        manufacturer,
        {},
        function (err, the_manufacturer) {
          if (err) {
            return next(err);
          }
          res.redirect(the_manufacturer.url);
        }
      );
    }
  },
];

exports.manufacturer_update_image_get = function (req, res, next) {
  Manufacturer.findById(req.params.id, function (err, result) {
    if (err) {
      return next(err);
    }
    if (result == null) {
      let err = new Error("Manufacturer not found.");
      err.status = 404;
      return next(err);
    }
    res.render("manufacturer/manufacturer-update-image", {
      title: "Update Manufacturer Image",
      manufacturer: result,
    });
  });
};

exports.manufacturer_update_image_post = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    const result = await uploadFile(req.file, "manufacturers");
    const manufacturer = new Manufacturer({
      oldCloudinary_id: req.body.oldCloudinary_id,
      _id: req.params.id,
      image_url: result.url,
      cloudinary_id: result.public_id,
    });

    if (req.body.oldCloudinary_id) {
      await deleteFile(req.body.oldCloudinary_id);
    }

    if (!errors.isEmpty()) {
      res.render("manufacturer-update-image", {
        title: "Update Manufacturer Image",
        errors: errors.array(),
      });
      return;
    } else {
      Manufacturer.findByIdAndUpdate(
        req.params.id,
        manufacturer,
        {},
        function (err, result) {
          if (err) {
            return next(err);
          }
          res.redirect(manufacturer.url);
        }
      );
    }
  },
];
