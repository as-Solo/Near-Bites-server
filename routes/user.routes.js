const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model")
const Booking = require("../models/Booking.model")
const Review = require("../models/Review.model")
const verifyToken = require("../middlewares/auth.middlewares");


// GET "/api/users" => Ver todos los usuarios
router.get("/", async (req, res, next)=>{
    try {
        const response = await User.find()
        res.json(response.data)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// GET "/api/users" => Ver todos los usuarios
router.get("/userby/:userId", async (req, res, next)=>{
    try {
        const response = await User.findById(req.params.userId)
        res.status(200).json(response)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// GET "/api/users/profile" => Ver un usuario concreto
// router.get("/:userId", async (req, res, next)=>{
router.get("/profile", verifyToken, async (req, res, next)=>{
    try {
        const response = await User.findById(req.payload._id)
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


// PATCH "/api/users/profile" => Editar un usuario en concreto
router.patch("/profile", verifyToken, async (req, res, next)=>{
    const { name, lastname, username, image } = req.body
    if (username){
        const foundUser = await User.findOne({username:username})
        if (foundUser){
            res.status(400).json({message: `${username} ya existe como nombre de usuario.`});
            return;
        }
    }
    try {
        const response = await User.findByIdAndUpdate(req.payload._id, { name, lastname, username, image},{new:true})
        res.json(response)
    } catch (error) {
        console.log(error);
        next(error);
    }
})


// DELETE "/api/users/profile" => Eliminar un usuario concreto
// router.delete("/:userId", async(req, res, next)=>{
router.delete("/profile", verifyToken, async(req, res, next)=>{
    const userId = req.payload._id
    if (userId){
        try {
            await Review.deleteMany({user: userId});
            await Booking.deleteMany({user: userId});
            const response = await User.findByIdAndDelete(req.payload._id)
            res.json({message:`El usuario ${response.name} ha sido eliminado.`})
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
    else{
        res.status(404).json({message: "No estás autorizado a hacer eso"})
    }
})

// GET "/api/users/:userId/wishlist" => Ver la whislist de usuario concreto
router.get("/wishlist", verifyToken, async (req, res, next)=>{
    try {
        const response = await User.findById(req.payload._id, 'wishlist')
        res.json(response)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// GET "/api/users/:userId/wishlist" => Ver la whislist de usuario concreto
router.get("/wishlist/populate", verifyToken, async (req, res, next)=>{
    try {
        const response = await User.findById(req.payload._id, 'wishlist').populate("wishlist")
        res.json(response)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// PUT "/api/users/fav/:restaurantId"
router.put("/fav/:restaurantId", verifyToken, async (req, res, next)=>{
    try {
        const {restaurantId} = req.params
        const userId = req.payload._id
        const response = await User.findByIdAndUpdate(
            userId,
            {$addToSet: {wishlist: restaurantId}}
        )
        res.status(200).json({message: `Restaurante añadido a tu lista de deseos`})
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// PUT "/api/users/unfav/:restaurantId"
router.put("/unfav/:restaurantId", verifyToken, async (req, res, next)=>{
    try {
        const {restaurantId} = req.params
        const userId = req.payload._id
        const response = await User.findByIdAndUpdate(
            userId,
            {$pull: {wishlist: restaurantId}}
        )
        res.status(200).json({message: `Restaurante eliminado de tu lista de deseos`})
    }
    catch (error) {
        console.log(error)
        next(error)
    }
})

// GET "/api/users/allfavs/:restaurantId"
router.get("/allfavs/:restaurantId", async (req, res, next)=>{
    const {restaurantId} = req.params
    // console.log(restaurantId)
    try {
        const response = await User.find({wishlist: restaurantId})
        res.status(200).json(response.length)
    }
    catch (error) {
        console.log(error)
        next(error)
    }
})

// GET "/api/users/pinimage" => Recuperar la imagen de un usuario
router.get("/pinimage", verifyToken, async (req, res, next)=>{
    try {
        const response = await User.findById(req.payload._id, 'image')
        res.json(response)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// GET "/api/users/owner" => Ver la listas de restaurantes de un usuario owner
router.get("/owner", verifyToken, async (req, res, next)=>{
    try {
        const response = await User.findById(req.payload._id, 'restaurantsOwned').populate("restaurantsOwned")
        res.json(response)
    } catch (error) {
        console.log(error);
        next(error);
    }
})

// PUT "/api/users/follow/:userId"
router.put("/follow/:userId", verifyToken, async (req, res, next)=>{
    try {
        const {userId} = req.params
        const loggedUser = req.payload._id
        const usuario = await User.findById(userId)
        const response = await User.findByIdAndUpdate(
            loggedUser,
            {$addToSet: {follow: userId}}
        )
        res.status(200).json({message: `Ahora sigues a ${usuario.username}`})
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// PUT "/api/users/unfollow/:userId"
router.put("/unfollow/:userId", verifyToken, async (req, res, next)=>{
    try {
        const {userId} = req.params
        const loggedUser = req.payload._id
        const usuario = await User.findById(userId)
        const response = await User.findByIdAndUpdate(
            loggedUser,
            {$pull: {follow: userId}}
        )
        res.status(200).json({message: `Has dejado de seguir a ${usuario.username}`})
    } catch (error) {
        console.log(error)
        next(error)
    }
})

// GET "/api/users/is-following/:userId"
router.get("/is-following/:userId", verifyToken, async (req, res, next)=>{
    try {
        const {userId} = req.params;
        const loggedUser = req.payload._id
        const response = await User.findById(loggedUser, 'follow')
        // console.log(response)
        if (response.follow.includes(userId)){
            res.status(200).json(true)
        }
        else{
            res.status(200).json(false)
        }
        
    } catch (error) {
        next(error)
    }
})

// GET "/api/users/followers"
router.get("/followers", verifyToken, async (req, res, next)=>{
    try {
        const loggedUser = req.payload._id
        const response = await User.find({follow:loggedUser})
        // console.log(response.length)
        res.status(200).json(response.length)
        
    } catch (error) {
        next(error)
    }
})

module.exports = router