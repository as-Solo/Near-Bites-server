const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    description: {type: String,  required: true},
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    restaurant: {type: Schema.Types.ObjectId, ref: "Restaurant", required: true},
  },
  {
    timestamps: true
  }
);

const Review = model("Review", userSchema);

module.exports = Review;