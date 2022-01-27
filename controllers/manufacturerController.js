// manufacturerController.js

const Item = require("../models/item");
var Manufacturer = require("../models/manufacturer");
const async = require("async");
const { body, validationResult } = require("express-validator");

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
  (req, res, next) => {
    const errors = validationResult(req);
    let manufacturer = new Manufacturer({
      name: req.body.name,
      description: req.body.description,
      established: req.body.established,
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
        Item.find({ manufacturer: req.params.id }).exec(callback);
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
    function (err, results) {
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
