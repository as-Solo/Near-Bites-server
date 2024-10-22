const router = require("express").Router();
const mongoose = require("mongoose");
const Booking = require("../models/Booking.model")
const User = require("../models/User.model.js");
const Restaurant = require("../models/Restaurant.model.js");
const verifyToken = require("../middlewares/auth.middlewares");

// GET "/api/bookings" => Ver todas las reservas
router.get('/', async (req, res, next)=>{
    try {
        const response = await Booking.find()
        res.json(response)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// GET "/api/bookings/:bookingId" => Ver una reserva en concreto
router.get('/:bookingId', async (req, res, next)=>{
    try {
        const response = await Booking.findById(req.params.bookingId)
        res.json(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

//todo tienes que checkear que exista el slot en el restaurante startHour debe estar en la lista
//todo de timeSlot del restaurante
//todo y ya que estas, valida que exista el restaurante y el user, que no te cuesta nada
//todo metele un verifyToken
// POST "/api/bookings" => Crear una reserva
router.post('/', verifyToken, async (req, res, next)=>{
    const { partySize, day, startHour, restaurant } = req.body
    const user = req.payload._id
    const foundUser = await User.findOne({_id:user});
    const foundRestaurant = await Restaurant.findOne({_id:restaurant});
    if (!foundUser || !foundRestaurant){
        res.status(400).json({message: "No se ha podido realizar la reserva."});
        return;
    }

    if (!foundRestaurant.timeSlots.includes(startHour)){
        res.status(400).json({message: "No ofrecemos servicio en ese horario."});
        return;
    }

    //* const slot = Restaurant.findById(restaurant)
    //* if (!slot.timeSlot.includes(startHour)) => message: "No damos servicio en ese turno"
    if( !partySize || !day || !startHour || !user || !restaurant){
        res.status(400).json({message:"Todos los campos son obligatorios"});
        return;
    }
    
    try {
        const response = await Booking.create({ partySize, day, startHour, user, restaurant})
        res.json(response);
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// DELETE "/api/bookings" => Eliminar una reserva
router.delete('/:bookingId', verifyToken, async (req, res, next)=>{
    try {
        const response = await Booking.findByIdAndDelete(req.params.bookingId)
        res.json({message: `La reserva ha sido eliminada`})
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// GET "/api/bookings/:restaurantId/:day" => Ver todas las reservas de un restaurante en un dia en concreto
router.get('/restaurants/:restaurantId/:day', async (req, res, next)=>{
    const {restaurantId, day} = req.params
   
    try {
        const response = await Booking.find({restaurant:restaurantId, day:day}, "startHour partySize")
        res.json(response)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// GET "/api/bookings/users/:userId" => Ver todas las reservas de un usuario
// router.get('/users/:userId', async (req, res, next)=>{
router.get('/users/bookingList', verifyToken, async (req, res, next)=>{
    const userId = req.payload._id
    try {
        const response = await Booking.find({user:userId}).populate({
            path:"restaurant",
            select: "name address rating profileImage"
        })
        .sort({ day: 1 });
        res.json(response)
    } catch (error) {
        console.log(error);
        next(error);
    }
})


module.exports = router