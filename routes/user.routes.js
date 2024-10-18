const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model")

// GET "/api/users" => Ver todos los usuarios
router.get("/", async (req, res, next)=>{
    try {
        const response = await User.find()
        res.json(response)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// GET "/api/users/:userId" => Ver un usuario concreto
router.get("/:userId", async (req, res, next)=>{
    try {
        const response = await User.findById(req.params.userId)
        res.json(response)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// POST "/api/users" => Crear un usuario
router.post("/", async (req, res, next)=>{
    const { email, password, name, lastname, username, image } = req.body
    try {
        const response = await User.create({email, password, name, lastname, username, image})
        res.json(response)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// PATCH "/api/users/:userId" => Editar un usuario en concreto
router.patch("/:userId", async (req, res, next)=>{
    const { email, password, name, lastname, username, image } = req.body
    if (username){
        const foundUser = User.findOne({username:username})
        if (foundUser){
            res.status(400).json({message: "Ese usuario ya existe"});
            return;
        }
    }
    try {
        const response = await User.findByIdAndUpdate(req.params.userId, {email, password, name, lastname, username, image},{new:true})
        res.json(response)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// DELETE "/api/users/:userId" => Eliminar un usuario concreto
router.delete("/:userId", async(req, res, next)=>{
    try {
        const response = await User.findByIdAndDelete(req.params.userId)
        res.json({message:`El usuario ${response.name} ha sido eliminado.`})
    } catch (error) {
        console.log(error);
        next(error)
    }
})


module.exports = router