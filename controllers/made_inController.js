// made_inController.js

const Item = require("../models/item");
var MadeIn = require("../models/made_in");
const async = require("async");
const { body, validationResult } = require("express-validator");
const { uploadFile, deleteFile } = require("../utils/cloudinary");

exports.made_in_list = function (req, res, next) {
  MadeIn.find({}, "name image_url")
    .sort({ name: 1 })
    .populate("image_url")
    .exec(function (err, list_made_ins) {
      if (err) {
        return next(err);
      }
      res.render("made_in/made_in-list", {
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
          .populate("manufacturer")
          .populate("image_url")
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
      res.render("made_in/made_in-detail", {
        title: "Country Detail",
        made_in: results.made_in,
        made_in_items: results.made_in_items,
      });
    }
  );
};

exports.made_in_create_get = function (req, res) {
  res.render("made_in/made_in-form-create", { title: "Create Country" });
};

exports.made_in_create_post = [
  body("name", "Country name required.").trim().isLength({ min: 1 }).escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    // upload image to Cloudinary
    let img = await uploadFile(req.file, "made_ins");

    let made_in = new MadeIn({
      name: req.body.name,
      image_url: img.url,
      cloudinary_id: img.public_id,
    });

    if (!errors.isEmpty()) {
      res.render("made_in/made_in-form-create", {
        title: "Create Country",
        made_in: made_in,
        errors: errors.array(),
      });
      return;
    } else {
      MadeIn.findOne({ name: req.body.name }).exec(function (
        err,
        found_made_in
      ) {
        if (err) {
          return next(err);
        }
        if (found_made_in) {
          res.redirect(found_made_in.url);
        } else {
          made_in.save(function (err) {
            if (err) {
              return next(err);
            }
            res.redirect(made_in.url);
          });
        }
      });
    }
  },
];

exports.made_in_delete_get = function (req, res, next) {
  async.parallel(
    {
      made_in: function (callback) {
        MadeIn.findById(req.params.id).exec(callback);
      },
      made_ins_items: function (callback) {
        Item.find({ made_in: req.params.id })
          .populate("manufacturer")
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.made_in == null) {
        res.redirect("/made_in");
      }
      res.render("made_in/made_in-delete", {
        title: "Delete Country",
        made_in: results.made_in,
        made_ins_items: results.made_ins_items,
      });
    }
  );
};

exports.made_in_delete_post = function (req, res, next) {
  async.parallel(
    {
      made_in: function (callback) {
        MadeIn.findById(req.body.made_inid).exec(callback);
      },
      made_ins_items: function (callback) {
        Item.find({ made_in: req.body.made_inid }).exec(callback);
      },
    },
    async function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.made_ins_items.length > 0) {
        res.render("made_in/made_in-delete", {
          title: "Delete Country",
          made_in: results.made_in,
          made_ins_items: results.made_ins_items,
        });
        return;
      } else {
        await deleteFile(results.made_in.cloudinary_id);
        MadeIn.findByIdAndRemove(
          req.body.made_inid,
          function deleteMadeIn(err) {
            if (err) {
              return next(err);
            }
            res.redirect("/made_ins");
          }
        );
      }
    }
  );
};

exports.made_in_update_get = function (req, res, next) {
  MadeIn.findById(req.params.id)
    .populate("name")
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("made_in/made_in-form-update", {
        title: "Update Country",
        made_in: results,
      });
    });
};
exports.made_in_update_post = [
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

    let made_in = new MadeIn({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("made_in/made_in-form-update", {
        title: "Update Country",
        made_in: made_in,
        errors: errors.array(),
      });
      return;
    } else {
      MadeIn.findByIdAndUpdate(
        req.params.id,
        made_in,
        {},
        function (err, the_made_in) {
          if (err) {
            return next(err);
          }
          res.redirect(the_made_in.url);
        }
      );
    }
  },
];

exports.made_in_update_image_get = function (req, res, next) {
  MadeIn.findById(req.params.id, function (err, result) {
    if (err) {
      return next(err);
    }
    if (result == null) {
      let err = new Error("Country not found.");
      err.status = 404;
      return next(err);
    }
    res.render("made_in/made_in-update-image", {
      title: "Update Country Image",
      made_in: result,
    });
  });
};

exports.made_in_update_image_post = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    const result = await uploadFile(req.file, "made_ins");
    const made_in = new MadeIn({
      oldCloudinary_id: req.body.oldCloudinary_id,
      _id: req.params.id,
      image_url: result.url,
      cloudinary_id: result.public_id,
    });

    if (req.body.oldCloudinary_id) {
      await deleteFile(req.body.oldCloudinary_id);
    }

    if (!errors.isEmpty()) {
      res.render("made_in-update-image", {
        title: "Update Country Image",
        errors: errors.array(),
      });
      return;
    } else {
      MadeIn.findByIdAndUpdate(
        req.params.id,
        made_in,
        {},
        function (err, result) {
          if (err) {
            return next(err);
          }
          res.redirect(made_in.url);
        }
      );
    }
  },
];
