const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    description: {type: String,  required: true},
    rating: {type: Number, default: 3},
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    restaurant: {type: Schema.Types.ObjectId, ref: "Restaurant", required: true},
  },
  {
    timestamps: true
  }
);

const Review = model("Review", reviewSchema);

module.exports = Review;