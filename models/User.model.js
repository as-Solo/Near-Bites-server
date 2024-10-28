const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {type: String, required: [true, 'Email is required.'], unique: true, lowercase: true, trim: true},
    password: {type: String, required: [true, 'Password is required.']},
    name: {type: String, trim: true, default:""},
    lastname: {type: String, trim: true, default:""},
    username: {type: String, unique: true, trim: true, required: [true, 'Username is required.'], default:""},
    image: {type: String, trim: true},
    coords: [String],
    rol: {type: String, enum:["user", "owner", "admin"], default: "user"},
    favourites: { type: [Schema.Types.ObjectId], ref: "Restaurant", default:[]},
    wishlist: { type: [Schema.Types.ObjectId], ref: "Restaurant", default:[]},
    restaurantsOwned: {type: [Schema.Types.ObjectId], ref: "Restaurant", default: []},
    follow: {type: [Schema.Types.ObjectId], ref: "User", default: []}
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
