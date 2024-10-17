const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {type: String, required: [true, 'Email is required.'], unique: true, lowercase: true, trim: true},
    password: {type: String, required: [true, 'Password is required.']},
    name: {type: String, trim: true},
    lastname: {type: String, trim: true},
    username: {type: String, unique: true, trim: true, required: [true, 'Username is required.']},
    image: {type: String, trim: true},
    coords: [String],
    rol: {type: String, enum:["user", "owner"], default: "user"},
    favourites: { type: [Schema.Types.ObjectId], ref: "Restaurant" },
    restaurantOwned: {type: [Schema.Types.ObjectId], ref: "Restaurant", default: []}
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
