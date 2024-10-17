const router = require("express").Router();
const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant.model");

// GET "/api/restaurants" => Ver todos los restaurantes
router.get("/", async (req, res, next)=>{
    try {
        const response = await Restaurant.find()
        res.json(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// GET "/api/restaurants/:restaurantId" => Ver un restaurante especifico
router.get("/:restaurantId", async (req, res, next)=>{
    try {
        const response = await Restaurant.findById(req.params.restaurantId);
        res.json(response)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// POST "/api/restaurants" => Crear un restaurante
router.post("/", async (req, res, next)=>{
    const {profileImage, images, name, coords, address, city, country, zip_code, categories, capacity, timeSlots, isDiscount, discountAmount} = req.body
    try {
        const response = await Restaurant.create({profileImage, images, name, coords, address, city, country, zip_code, categories, capacity, timeSlots, isDiscount, discountAmount});
        res.json({message: `El restaurante ${response.name} ha sido creado`})
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// PATCH "/api/restaurants/:restaurantId" => Editar un restaurante
router.patch("/:restaurantId", async (req, res, next)=>{
    const {profileImage, images, name, coords, address, city, country, zip_code, categories, capacity, timeSlots, isDiscount, discountAmount} = req.body
    try {
        const response = await Restaurant.findByIdAndUpdate(req.params.restaurantId, {profileImage, images, name, coords, address, city, country, zip_code, categories, capacity, timeSlots, isDiscount, discountAmount}, {new:true})
        res.json({message: `${response.name} ha sido actualizado con éxito`})
    } catch (error) {
        console.log(error);
        next(error)
    }
})

// DELETE "/api/restaurants/:restaurantId" => Eliminar un restaurante
router.delete("/:restaurantId", async (req, res, next)=>{
    try {
        const response = await Restaurant.findByIdAndDelete(req.params.restaurantId);
        res.json({message: `El restaurante ${response.name} ha sido eliminado`})
    } catch (error) {
        console.log(error);
        next(error);
    }
})

module.exports = router