const mongoose = require("mongoose");
const verifyToken = require("../middlewares/auth.middlewares");
const router = require("express").Router();
const Message = require("../models/Message.model")
const User = require("../models/User.model")
const { ObjectId } = require('mongoose').Types;


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

// GET "/api/messages/group-by/conversation/:userId"
router.get("/group-by/conversation/:userId", verifyToken, async (req, res, next)=>{
    const {userId} = req.params
    const loggedUser = req.payload._id
    const userIdObj = new ObjectId(userId);
    const loggedUserObj = new ObjectId(loggedUser);
    try {
        const messages = await Message.aggregate([
            {
              $match: {
                $or: [
                    { remitente: userIdObj, destinatario: loggedUserObj },
                    { remitente: loggedUserObj, destinatario: userIdObj }
                ]
              }
            },
            {
              $addFields: {
                day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
              }
            },
            {
              $sort: { createdAt: 1 }
            },
            {
              $group: {
                _id: "$day",
                messages: { $push: "$$ROOT" }
              }
            },
            {
              $project: {
                _id: 0,
                day: "$_id",
                messages: 1
              }
            },
            {
              $sort: { day: 1 }
            }
          ]);
        res.status(200).json(messages)
    }
    catch (error) {
        console.log(error)
        nest(error)
    }
})

// GET "/api/messages/chatlist" => Devuelve toda la lista de conversaciones abiertas
router.get("/chatlist", verifyToken, async (req, res, next)=>{
  const loggedUser = req.payload._id
  try {
    const listaUsuarios = await User.findById(loggedUser, 'accepted')
    .populate({
      path: 'accepted',
      match: {accepted: loggedUser},
      select: 'image username createdAt'
    })
    .lean(); // Convierte el resultado en un objeto plano para mejor manipulación

    // Añadimos el conteo de seguidores para cada usuario en "accepted"
    const acceptedUsersWithFollowersCount = await Promise.all(
      listaUsuarios.accepted.map(async (acceptedUser) => {
        const followersCount = await User.countDocuments({ follow: acceptedUser._id });
        const followCount = acceptedUser.follow? acceptedUser.follow.length : 0; ;
        return { ...acceptedUser, followCount, followersCount }; // Añade el campo "followersCount"
      })
    );

    // Devuelve solo los campos requeridos
    res.status(200).json({
      accepted: acceptedUsersWithFollowersCount, // Solo devolvemos "accepted" con el conteo de seguidores
    });
  }
  catch (error) {
    console.log(error)
    next(error)
  }
})

module.exports = router