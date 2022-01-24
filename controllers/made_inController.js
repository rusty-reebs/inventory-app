// made_inController.js

const { findOneAndUpdate } = require("../models/item");
const Item = require("../models/item");
var MadeIn = require("../models/made_in");
const async = require("async");

exports.made_in_list = function (req, res, next) {
  MadeIn.find({}, "name img")
    .sort({ name: 1 })
    .exec(function (err, list_made_ins) {
      if (err) {
        return next(err);
      }
      res.render("made_in-list", {
        title: "Made In",
        made_in_list: list_made_ins,
      });
    });
};

exports.made_in_detail = function (req, res, next) {
  async.parallel(
    {
      made_in: function (callback) {
        MadeIn.findById(req.params.id).exec(callback);
      },
      made_in_items: function (callback) {
        Item.find({ made_in: req.params.id }, "made_in summary")
          .populate("name")
          .populate("img")
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.made_in == null) {
        let err = new Error("Country not found.");
        err.status = 404;
        return next(err);
      }
      res.render("made_in-detail", {
        title: "Country Detail",
        made_in: results.made_in,
        made_in_items: results.made_in_items,
      });
    }
  );
};

exports.made_in_create_get = function (req, res) {
  res.render("made_in-form-create", { title: "Create Country" });
};
exports.made_in_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED");
};

exports.made_in_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED");
};
exports.made_in_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED");
};

exports.made_in_update_get = function (req, res, next) {
  MadeIn.findById(req.params.id)
    .populate("name")
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("made_in-form-update", {
        title: "Update Country",
        made_in: results,
      });
    });
};
exports.made_in_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED");
};
