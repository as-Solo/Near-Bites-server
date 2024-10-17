const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    partySize: Number,
    day: Date,
    startHour: {type: String},
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    restaurant: {type: Schema.Types.ObjectId, ref: "Restaurant", required: true}
  },
  {
    timestamps: true
  }
);

const Booking = model("Booking", userSchema);

module.exports = Booking;