const router = require("express").Router();
const mongoose = require("mongoose");
const Booking = require("../models/Booking.model")

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

// POST "/api/bookings" => Crear una reserva
router.post('/', async (req, res, next)=>{
    const { partySize, day, startHour, user, restaurant } = req.body
    try {
        const response = await Booking.create({ partySize, day, startHour, user, restaurant})
        res.json(response);
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// DELETE "/api/bookings" => Eliminar una reserva
router.delete('/:bookingId', async (req, res, next)=>{
    try {
        const response = await Booking.findByIdAndDelete(req.params.bookingId)
        res.json({message: `La reserva ha sido eliminada`})
    } catch (error) {
        console.log(error);
        next(error);
    }
})

module.exports = router