// itemController.js

var Item = require("../models/item");
var Manufacturer = require("../models/manufacturer");
var MadeIn = require("../models/made_in");
var Category = require("../models/category");
const { body, validationResult } = require("express-validator");

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
        title: "Store Inventory",
        error: err,
        data: results,
      });
    }
  );
};

exports.item_list = function (req, res, next) {
  Item.find(
    {},
    "name category manufacturer description price made_in number_in_stock img"
  )
    .sort({ category: 1 })
    .populate("manufacturer")
    .populate("made_in")
    .populate("category")
    .exec(function (err, list_items) {
      if (err) {
        return next(err);
      }
      res.render("item-list", { title: "All Items", item_list: list_items });
    });
};

exports.item_detail = function (req, res, next) {
  Item.findById(req.params.id)
    .populate("manufacturer")
    .populate("category")
    .populate("made_in")
    .exec(function (err, item_details) {
      if (err) {
        return next(err);
      }
      res.render("item-detail", { item_details: item_details });
    });
};

exports.item_create_get = function (req, res, next) {
  async.parallel(
    {
      manufacturers: function (callback) {
        Manufacturer.find(callback);
      },
      categories: function (callback) {
        Category.find(callback);
      },
      made_ins: function (callback) {
        MadeIn.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("item-form-create", {
        title: "Create Item",
        manufacturers: results.manufacturers,
        categories: results.categories,
        made_ins: results.made_ins,
      });
    }
  );
};

exports.item_create_post = [
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === "undefined") req.body.category = [];
    } else {
      req.body.category = new Array(req.body.category);
    }
    next();
  },
  //   body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  //   body("description", "Description must not be empty.")
  //     .trim()
  //     .isLength({ min: 1 })
  //     .escape(),
  //   body("manufacturer", "Manufacturer must not be empty.")
  //     .trim()
  //     .isLength({ min: 1 })
  //     .escape(),
  //   body("made_in", "Made In must not be empty.")
  //     .trim()
  //     .isLength({ min: 1 })
  //     .escape(),
  //   body("price", "Price must not be empty.")
  //     .trim()
  //     .isLength({ min: 1 })
  //     .escape(),
  //   body("number_in_stock", "Number in stock must not be empty.")
  //     .trim()
  //     .isLength({ min: 1 })
  //     .escape(),
  //   body("category.*").escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors);

    let item = new Item({
      name: req.body.name,
      description: req.body.description,
      manufacturer: req.body.manufacturer,
      made_in: req.body.made_in,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      async.parallel(
        {
          manufacturers: function (callback) {
            Manufacturer.find(callback);
          },
          categories: function (callback) {
            Category.find(callback);
          },
          made_ins: function (callback) {
            MadeIn.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }
          for (let i = 0; i < results.categories.length; i++) {
            if (item.category.indexOf(results.categories[i]._id) > -1) {
              results.categories[i].checked = "true";
            }
          }
          res.render("item-form-create", {
            title: "Create Item",
            manufacturers: results.manufacturers,
            categories: results.categories,
            made_ins: results.made_ins,
            item: item,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      item.save(function (err) {
        if (err) {
          console.log(err);
          return next(err);
        }
        res.redirect(item.url);
      });
    }
  },
];

exports.item_delete_get = function (req, res, next) {
  Item.findById(req.params.id)
    .populate("manufacturer")
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      if (results == null) {
        res.redirect("/items");
      }
      res.render("item-delete", {
        title: "Delete Item",
        item: results,
      });
    });
};
exports.item_delete_post = function (req, res, next) {
  Item.findByIdAndRemove(req.body.itemid, function deleteItem(err) {
    if (err) {
      return next(err);
    }
    res.redirect("/items");
  });
};

exports.item_update_get = function (req, res, next) {
  async.parallel(
    {
      item: function (callback) {
        Item.findById(req.params.id)
          .populate("description")
          .populate("manufacturer")
          .populate("category")
          .populate("made_in")
          .exec(callback);
      },
      manufacturers: function (callback) {
        Manufacturer.find(callback);
      },
      categories: function (callback) {
        Category.find(callback);
      },
      made_ins: function (callback) {
        MadeIn.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.item === null) {
        let err = new Error("Item not found.");
        err.status = 404;
        return next(err);
      }
      for (
        let all_category_iter = 0;
        all_category_iter < results.categories.length;
        all_category_iter++
      ) {
        for (
          let item_category_iter = 0;
          item_category_iter < results.item.category.length;
          item_category_iter++
        ) {
          if (
            results.categories[all_category_iter]._id.toString() ===
            results.item.category[item_category_iter]._id.toString()
          ) {
            results.categories[all_category_iter].checked = "true";
          }
        }
      }
      res.render("item-form-update", {
        title: "Update Item",
        manufacturers: results.manufacturers,
        categories: results.categories,
        item: results.item,
        made_ins: results.made_ins,
      });
    }
  );
};

exports.item_update_post = [
  (req, res, next) => {
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === "undefined") {
        req.body.category = [];
      } else {
        req.body.category = new Array(req.body.category);
      }
    }
    next();
  },
  //   body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  //   body("description", "Description must not be empty.")
  //     .trim()
  //     .isLength({ min: 1 })
  //     .escape(),
  //   body("manufacturer", "Manufacturer must not be empty.")
  //     .trim()
  //     .isLength({ min: 1 })
  //     .escape(),
  //   body("made_in", "Made In must not be empty.")
  //     .trim()
  //     .isLength({ min: 1 })
  //     .escape(),
  //   body("price", "Price must not be empty.").trim().isInt({ min: 1 }).escape(),
  //   body("number_in_stock", "Number in stock must not be empty.")
  //     .trim()
  //     .isInt({ min: 1 })
  //     .escape(),
  //   body("category.*").escape(),

  (req, res, next) => {
    let errors = validationResult(req);
    console.log(errors);

    let item = new Item({
      name: req.body.name,
      description: req.body.description,
      manufacturer: req.body.manufacturer,
      made_in: req.body.made_in,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      category:
        typeof req.body.category === "undefined" ? [] : req.body.category,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      async.parallel(
        {
          manufacturers: function (callback) {
            Manufacturer.find(callback);
          },
          categories: function (callback) {
            Category.find(callback);
          },
          made_ins: function (callback) {
            MadeIn.find(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }
          for (let i = 0; i < results.categories.length; i++) {
            if (item.category.indexOf(results.categories[i]._id) > -1) {
              results.categories[i].checked = "true";
            }
          }
          res.render("item-form-update", {
            title: "Update Item",
            manufacturers: results.manufacturers,
            categories: results.categories,
            made_ins: results.made_ins,
            item: item,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      Item.findByIdAndUpdate(req.params.id, item, {}, function (err, the_item) {
        if (err) {
          return next(err);
        }
        res.redirect(the_item.url);
      });
    }
  },
];
