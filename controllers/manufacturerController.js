// manufacturerController.js

const Item = require("../models/item");
var Manufacturer = require("../models/manufacturer");
const async = require("async");

exports.manufacturer_list = function (req, res, next) {
  Manufacturer.find({}, "name description established img")
    .sort({ name: 1 })
    .exec(function (err, list_manufacturers) {
      if (err) {
        return next(err);
      }
      res.render("manufacturer-list", {
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
          .exec(callback);
      },
      manufacturers_items: function (callback) {
        Item.find({ manufacturer: req.params.id }, "item summary")
          .populate("name")
          .populate("img")
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
      res.render("manufacturer-detail", {
        title: "Manufacturer Detail",
        manufacturer: results.manufacturer,
        manufacturer_items: results.manufacturers_items,
      });
    }
  );
};

exports.manufacturer_create_get = function (req, res) {
  res.render("manufacturer-form-create", { title: "Create Manufacturer" });
};

exports.manufacturer_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED");
};

exports.manufacturer_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED");
};
exports.manufacturer_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED");
};

(exports.manufacturer_update_get = function (req, res, next) {
  Manufacturer.findById(req.params.id)
    .populate("name")
    .populate("description")
    .populate("established")
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("manufacturer-form-update", {
        title: "Update Manufacturer",
        manufacturer: results,
      });
    });
}),
  (exports.manufacturer_update_post = function (req, res) {
    res.send("NOT IMPLEMENTED");
  });
