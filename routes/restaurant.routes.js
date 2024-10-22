const router = require("express").Router();
const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant.model");
const verifyToken = require("../middlewares/auth.middlewares");

// GET "/api/restaurants" => Ver todos los restaurantes
router.get("/", async (req, res, next)=>{
    try {
        const response = await Restaurant.find()
        res.json(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
});

// GET "/api/restaurants/:restaurantId" => Ver un restaurante especifico
router.get("/:restaurantId", async (req, res, next)=>{
    try {
        const response = await Restaurant.findById(req.params.restaurantId);
        res.json(response)
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// // GET "/api/restaurants/:restaurantId/reviews" => Ver un restaurante especifico
// router.get("/:restaurantId/reviews", async (req, res, next)=>{
//     try {
//         const response = await Restaurant.findById(req.params.restaurantId).populate("review");
//         res.json(response)
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// })

// POST "/api/restaurants" => Crear un restaurante
router.post("/", async (req, res, next)=>{
    const {profileImage, images, name, description, coords, rating, price, address, city, country, zip_code, categories, capacity, timeSlots, isDiscount, discountAmount} = req.body
    try {
        const response = await Restaurant.create({profileImage, images, name, description, coords, rating, price, address, city, country, zip_code, categories, capacity, timeSlots, isDiscount, discountAmount});
        res.json({message: `El restaurante ${response.name} ha sido creado`})
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// PATCH "/api/restaurants/:restaurantId" => Editar un restaurante
router.patch("/:restaurantId", async (req, res, next)=>{
    const {profileImage, images, name, description, coords, rating, address, city, country, zip_code, categories, capacity, timeSlots, isDiscount, discountAmount} = req.body
    try {
        const response = await Restaurant.findByIdAndUpdate(req.params.restaurantId, {profileImage, images, name, description, coords, rating, address, city, country, zip_code, categories, capacity, timeSlots, isDiscount, discountAmount}, {new:true})
        res.json({message: `${response.name} ha sido actualizado con éxito`})
    } catch (error) {
        console.log(error);
        next(error)
    }
});

// DELETE "/api/restaurants/:restaurantId" => Eliminar un restaurante
router.delete("/:restaurantId", async (req, res, next)=>{
    try {
        const response = await Restaurant.findByIdAndDelete(req.params.restaurantId);
        res.json({message: `El restaurante ${response.name} ha sido eliminado`})
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// GET "/api/restaurants/:longitude/:latitude/:distance/:limit"
router.get("/:longitude/:latitude/:distance/:limit", async (req, res, next)=>{
    try {
        const {longitude, latitude, distance, limit} = req.params
        const response = await Restaurant.find({
            coords: {
              $near: {
                $geometry: {
                  type: "Point",
                  coordinates: [longitude, latitude]
                },
                $maxDistance: distance // el valor son metros
              }
            }
          })
          .limit(limit)
        res.json(response)
        
    } catch (error) {
        console.log(error)
        next(error)
    }
});

// PUT "/api/restaurants/like"
router.put("/like", verifyToken, async (req, res, next)=>{
    try {
        const {restaurantId} = req.body
        const userId = req.payload._id
        const response = await Restaurant.updateOne(
            {_id: restaurantId},
            {$addToSet: {likes: userId}}
        )
        res.status(200).json({message: `Restaurante añadido a tu lista de favoritos`})
    } catch (error) {
        console.log(error)
        next(error)
    }
});

// PUT "/api/restaurants/unlike"
router.put("/unlike", verifyToken, async (req, res, next)=>{
    try {
        const {restaurantId} = req.body
        const userId = req.payload._id
        const response = await Restaurant.updateOne(
            {_id: restaurantId},
            {$pull: {likes: userId}}
        )
        res.status(200).json({message: `Restaurante eliminado de tu lista de favoritos`})
    } catch (error) {
        console.log(error)
        next(error)
    }
});

// GET "/api/restaurants/:restaurantId/time_slots"
router.get('/:restaurantId/time_slots', async (req, res, next) =>{
    try {
        const response = await Restaurant.findById(req.params.restaurantId, "timeSlots capacity")
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
});

// GET "/api/restaurants/unique/categories" => Obtener todas las categorías únicas
router.get("/unique/categories", async (req, res, next) => {
    try {
      const uniqueCategories = await Restaurant.distinct("categories");
      
      res.json(uniqueCategories);
    } catch (error) {
      console.log(error);
      next(error);
    }
  });


// POST "/api/restaurants/filters/dinamicos/:longitude/:latitude/:distance/:limit" => La locura
router.post("/filters/dinamicos/:longitude/:latitude/:distance/:limit", async (req, res, next) => {
    const {queryString, categoriesList = []} = req.body
    const {longitude, latitude, distance, limit} = req.params
    let query = {}
    
    if (queryString && categoriesList.length > 0){
        const regex = new RegExp(queryString, "i")
        query.$and = [{
            $or: [
              { name: { $regex: regex } },
              { address: { $regex: regex } },
              { categories: { $regex: regex } }
            ]}, 
            { categories: { $in: categoriesList } }
          ]}

    else if (categoriesList.length > 0){
        query.categories = { $in: categoriesList }
    }
    else if (queryString){
        const regex = new RegExp(queryString, "i")
        query.$or = [
            { name: { $regex: regex } },
            { address: { $regex: regex } },
            { categories: { $regex: regex } }
          ]
    }
    try {
      const response = await Restaurant.find({
        ...query,
        coords: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [longitude, latitude]
              },
              $maxDistance: distance // el valor son metros
            }
          }
          
      }).limit(limit);
      res.json(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  });


  // GET  "/api/restaurants/userlike => conseguir todos los restaurantes con like de un usuario
  router.get("/user/like", verifyToken, async (req, res, next)=>{
    console.log("Entrando")
    const userId = req.payload._id
    console.log(userId)
    try {
        const response = await Restaurant.find({ likes: userId })
        res.status(200).json(response)
        
    } catch (error) {
        console.log(error)
        next(error)
    }
  });
  

module.exports = router