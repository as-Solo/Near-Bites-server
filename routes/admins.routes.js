const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model")
const verifyToken = require("../middlewares/auth.middlewares");

router.get("/", (req, res, next) => {
    res.json("All good in here");
  });
  
router.get("/users", verifyToken, async (req, res, next)=>{
  const {rol} = req.payload

  if(rol === "admin"){
    try {
      const response = await User.find( { rol:{ $ne: 'admin' } } )
      res.status(200).json(response)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
  else{
    res.status(401).json({message: "¿Qué andas haciendo tú por aquí pillín?"})
  }
})

router.patch("/change_rol", verifyToken, async (req, res, next)=>{
  const {rol} = req.payload
  const {userId, newRol} = req.body
  console.log(userId, newRol)
  if (rol === "admin"){
    try {
      const response = await User.findByIdAndUpdate(userId, {rol:newRol}, { new: true })
      res.status(200).json(response)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
  else{
    res.status(401).json({message:"Tira pallá bobo"})
  }
})

router.delete("/users/:userId", verifyToken, async (req, res, next)=>{
  const {rol} = req.payload
  const {userId} = req.params
  if (rol === "admin"){
    try {
      const response = await User.findByIdAndDelete(userId)
      res.status(200).json(response)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
  else{
    res.status(401).json({message:"Tira pallá bobo"})
  }
})

module.exports = router;