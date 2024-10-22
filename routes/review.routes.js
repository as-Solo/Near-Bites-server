const router = require("express").Router();
const mongoose = require("mongoose");
const Review = require("../models/Review.model")
const verifyToken = require("../middlewares/auth.middlewares");


// GET "/api/reviews" => Ver todas las reseñas
router.get('/', async (req, res, next)=>{
    try {
        const response = await Review.find()
        res.json(response)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// GET "/api/reviews/:restaurantId/with_users" => Ver todas las reseñas
router.get('/:restaurantId/with_users', async (req, res, next)=>{
    try {
        const response = await Review.find({restaurant:req.params.restaurantId})
        .populate({
            path:"user",
            select:"username image"
        })
        .sort({ createdAt: -1 })
        res.json(response)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// GET "/api/reviews/:reviewId" => Ver una reseña
router.get('/:reviewId', async (req, res, next)=>{
    try {
        const response = await Review.findById(req.params.reviewId)
        res.json(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// POST "/api/reviews" => Crear una reseña
router.post('/', verifyToken, async (req, res, next)=>{
    const { description, rating, restaurant } = req.body
    const user = req.payload._id
    try {
        const response = await Review.create({description, rating, user, restaurant})
        res.json(response);
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// PATCH "/api/reviews/:reviewId" => Editar una reseña
router.patch('/:reviewId', async (req, res, next)=>{
    const {description} = req.body
    try {
        const response = await Review.findByIdAndUpdate(req.params.reviewId, {description}, {new:true})
        res.json(response)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// DELETE "/api/reviews/:reviewId" => Eliminar una reseña
router.delete('/:reviewId', verifyToken, async (req, res, next)=>{
    try {
        const response = await Review.findByIdAndDelete(req.params.reviewId)
        res.json({message: `La reseña '${response.description}' ha sido eliminada`})
    } catch (error) {
        console.log(error);
        next(error);
    }
})

module.exports = router