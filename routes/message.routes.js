const mongoose = require("mongoose");
const verifyToken = require("../middlewares/auth.middlewares");
const router = require("express").Router();
const Message = require("../models/Message.model")
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

module.exports = router


// const messages = await Message.aggregate([
//     {
//       $match: {
//         $or: [
//           { remitente: userId1, destinatario: userId2 },
//           { remitente: userId2, destinatario: userId1 }
//         ]
//       }
//     },
//     {
//       $addFields: {
//         day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
//       }
//     },
//     {
//       $sort: { createdAt: 1 }  // Asegura que los mensajes se ordenen por createdAt ascendente
//     },
//     {
//       $group: {
//         _id: "$day",
//         messages: { $push: "$$ROOT" }
//       }
//     },
//     {
//       $project: {
//         _id: 0,
//         day: "$_id",
//         messages: 1
//       }
//     },
//     {
//       $sort: { day: 1 }
//     }
//   ]);
  