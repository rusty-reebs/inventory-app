var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 300 },
  manufacturer: {
    type: Schema.Types.ObjectId,
    ref: "Manufacturer",
    required: true,
  },
  made_in: { type: Schema.Types.ObjectId, ref: "Made In", required: true },
  category: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
  price: { type: Number, required: true },
  number_in_stock: { type: Number, required: true },
});

ItemSchema.virtual("url").get(function () {
  return "/items/" + this._id;
});

module.exports = mongoose.model("Item", ItemSchema);
