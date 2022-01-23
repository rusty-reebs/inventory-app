var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ManufacturerSchema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 1000 },
  established: { type: Number, required: true },
});

ManufacturerSchema.virtual("url").get(function () {
  return "/manufacturer/" + this._id;
});

module.exports = mongoose.model("Manufacturer", ManufacturerSchema);
