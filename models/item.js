var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 1000 },
  manufacturer: {
    type: Schema.Types.ObjectId,
    ref: "Manufacturer",
    required: true,
  },
  made_in: { type: Schema.Types.ObjectId, ref: "Made In", required: true },
  category: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
  price: { type: Number, required: true },
  number_in_stock: { type: Number, required: true },
  image_url: { type: String, maxLength: 500 },
  cloudinary_id: { type: String, maxLength: 500 },
});

ItemSchema.virtual("url").get(function () {
  return "/item/" + this._id;
});

module.exports = mongoose.model("Item", ItemSchema);
