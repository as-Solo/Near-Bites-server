const mongoose = require("mongoose");
const verifyToken = require("../middlewares/auth.middlewares");
const router = require("express").Router();
const Message = require("../models/Message.model")


// POST "/api/messages/:userId"
router.post("/:userId", verifyToken, async (req, res, next)=>{
    const {userId} = req.params
    const loggedUser = req.payload._id
    const newMessage = {
        destinatario: userId,
        remitente: loggedUser,
        mensaje: req.body.message,
        isRead: false
    }
    try {
        const response = await Message.create(newMessage)
        res.status(201).json(response)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// GET "/api/messages/conversation/:userId"
router.get("/conversation/:userId", verifyToken, async (req, res, next)=>{
    const {userId} = req.params
    const loggedUser = req.payload._id
    try {
        const response = await Message.find({
            $or: [
                {remitente: userId, destinatario: loggedUser},
                {remitente: loggedUser, destinatario: userId}
            ]
        }).sort({createdAt: 1})
        res.status(200).json(response)
    }
    catch (error) {
        console.log(error)
        nest(error)
    }
})

module.exports = router