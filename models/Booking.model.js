const { Schema, model } = require("mongoose");

const bookingSchema = new Schema(
  {
    partySize: {type: Number, required: true},
    day: {type: Date, required: true},
    startHour: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    restaurant: {type: Schema.Types.ObjectId, ref: "Restaurant", required: true}
  },
  {
    timestamps: true
  }
);

const Booking = model("Booking", bookingSchema);

module.exports = Booking;