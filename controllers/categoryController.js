// categoryController.js

var Category = require("../models/category");
const Item = require("../models/item");
const async = require("async");

exports.category_list = function (req, res, next) {
  Category.find({}, "name")
    .sort({ name: 1 })
    .exec(function (err, list_categories) {
      if (err) {
        return next(err);
      }
      res.render("category-list", {
        title: "Item Categories",
        category_list: list_categories,
      });
    });
};

exports.category_detail = function (req, res, next) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_items: function (callback) {
        Item.find({ category: req.params.id }, "category summary")
          .populate("name")
          .populate("img")
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        let err = new Error("Category not found.");
        err.status = 404;
        return next(err);
      }
      res.render("category-detail", {
        title: "Category Detail",
        category: results.category,
        category_items: results.category_items,
      });
    }
  );
};

exports.category_create_get = function (req, res) {
  res.render("category-form-create", { title: "Create Category" });
};
exports.category_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED");
};

exports.category_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED");
};
exports.category_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED");
};

exports.category_update_get = function (req, res, next) {
  Category.findById(req.params.id)
    .populate("name")
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("category-form-update", {
        title: "Update Category",
        category: results,
      });
    });
};

exports.category_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED");
};
