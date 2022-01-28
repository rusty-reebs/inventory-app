// made_in.js

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var MadeInSchema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  image_url: { type: String, maxlength: 500 },
  cloudinary_id: { type: String, maxlength: 500 },
});

MadeInSchema.virtual("url").get(function () {
  return "/made_in/" + this._id;
});

module.exports = mongoose.model("Made In", MadeInSchema);
