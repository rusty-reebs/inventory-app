// itemController.js

var Item = require("../models/item");
var Manufacturer = require("../models/manufacturer");
var MadeIn = require("../models/made_in");
var Category = require("../models/category");

var async = require("async");

exports.index = function (req, res) {
  async.parallel(
    {
      item_count: function (callback) {
        Item.countDocuments({}, callback);
      },
      manufacturer_count: function (callback) {
        Manufacturer.countDocuments({}, callback);
      },
      made_in_count: function (callback) {
        MadeIn.countDocuments({}, callback);
      },
      category_count: function (callback) {
        Category.countDocuments({}, callback);
      },
    },
    function (err, results) {
      res.render("index", {
        title: "Cycle Logical - Store Inventory",
        error: err,
        data: results,
      });
    }
  );
};

exports.item_list = function (req, res, next) {
  Item.find(
    {},
    "name category manufacturer description price made_in number_in_stock"
  )
    .sort({ category: 1 })
    .populate("manufacturer")
    .populate("made_in")
    .populate("category")
    .exec(function (err, list_items) {
      if (err) {
        return next(err);
      }
      res.render("item-list", { title: "Items", item_list: list_items });
    });
};

exports.item_detail = function (req, res) {
  res.send("NOT IMPLEMENTED");
};

exports.item_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED");
};
exports.item_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED");
};

exports.item_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED");
};
exports.item_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED");
};

exports.item_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED");
};
exports.item_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED");
};
