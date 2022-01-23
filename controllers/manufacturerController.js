// manufacturerController.js

var Manufacturer = require("../models/manufacturer");

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
  Manufacturer.findById(req.params.id)
    .populate("description")
    .populate("established")
    .exec(function (err, manufacturer_details) {
      if (err) {
        return next(err);
      }
      res.render("manufacturer-detail", {
        manufacturer_details: manufacturer_details,
      });
    });
};

exports.manufacturer_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED");
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

exports.manufacturer_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED");
};
exports.manufacturer_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED");
};
