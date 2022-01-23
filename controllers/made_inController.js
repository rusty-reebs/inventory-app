// made_inController.js

var MadeIn = require("../models/made_in");

exports.made_in_list = function (req, res, next) {
  MadeIn.find({}, "name img")
    .sort({ name: 1 })
    .exec(function (err, list_made_ins) {
      if (err) {
        return next(err);
      }
      res.render("made_in-list", {
        title: "Countries",
        made_in_list: list_made_ins,
      });
    });
};

exports.made_in_detail = function (req, res, next) {
  MadeIn.findById(req.params.id).exec(function (err, made_in_details) {
    if (err) {
      return next(err);
    }
    res.render("made_in-detail", {
      made_in_details: made_in_details,
    });
  });
};

exports.made_in_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED");
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

exports.made_in_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED");
};
exports.made_in_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED");
};
