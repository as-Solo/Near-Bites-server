const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    profileImage: {type: String, trim: true},
    images: {type: [String], trim: true},
    name: {type: String, trim: true, required: true},
    description: {type: String, trim: true},
    coords: {type: [Number], index: "2dsphere", unique: true, trim: true},
    rating: {type: Number, default:0},
    price: {type: Number},
    //todo si hago un objeto con los siguientes 4 parametros, puedo evaluar un unique en conjunto?
    address: {type: String, trim: true, required: true},
    city: {type: String, trim: true, required: true},
    country: {type: String, trim: true, required: true},
    zip_code: {type: String, trim: true, required: true},
    //todo En el enum, deberias sacarte las categorias de yelp, por si al final luego lo usas, tener las mismas etiquetas de busqueda
    categories: {type: [String], enum:["hamburguer", "pizza", "mexican", "indian", "spanish"]},
    capacity: {type: Number},
    timeSlots: {type: [String], default: ["20:00", "21:00", "22:00", "23:00", "00:00"]},
    isDiscount: {type: Boolean, default: false},
    discountAmount: {type: Number, default: 0.0},
    likes: {type: [Schema.Types.ObjectId], ref: "User", default: []}
  },
  {
    timestamps: true
  }
);

const Restaurant = model("Restaurant", userSchema);

module.exports = Restaurant;