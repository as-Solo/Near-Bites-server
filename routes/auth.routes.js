const router = require("express").Router();
const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/auth.middlewares");

// POST "/api/auth/signup" => Crear un usuario
router.post("/signup", async (req, res, next)=>{
    const {email, password, username} = req.body;
    
    if (!email || !password || !username){
        res.status(400).json({message:"Todos los campos son obligatorios"});
        return;
    }

    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/gm;
    if (!regexPassword.test(password)){
        res.status(400).json({message: "La contraseña debe tener mayúsculas, minúsculas, un número y entre 8 y 16 caracteres."});
        return;
    }
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gm;
    if (!regexEmail.test(email)){
        res.status(400).json({message: "Introduce un mail válido"});
        return;
    }
    const regexUser = /^[a-zA-Z0-9_-]+$/gm;
    if (!regexUser.test(username)){
      res.status(400).json({message: "El nombre de usuario solo puede tener letras numeros y guiones"});
      return;
    }

    try {
        const foundUserMail = await User.findOne({email:email});
        const foundUserName = await User.findOne({username:username});
        if (foundUserMail || foundUserName){
            res.status(400).json({message: "Ese usuario ya existe"});
            return;
        }
        const salt = await bcrypt.genSalt(12);
        const cypherPassword = await bcrypt.hash(password, salt);
        await User.create({email, password:cypherPassword, username});
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        next(error);
    }
})

//POST "/api/auth/login" => Verificar credenciales
router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Los dos campos son obligatorios" });
      return;
    }
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gm;
    if (!regexEmail.test(email)){
        res.status(400).json({message: "Introduce un mail válido"});
        return;
    }
    try {
      const foundUser = await User.findOne({ email: email });
      if(!foundUser){
        res.status(400).json({ message: "Credenciales incorrectas" });
        return;
      }
      const isPasswordCorrect = await bcrypt.compare(
        password,
        foundUser.password
      );
      if (!isPasswordCorrect) {
        res.status(400).json({ message: "Credenciales incorrectas" });
        return;
      }

      const payload = {
        _id: foundUser._id,
        email: foundUser.email,
        rol: foundUser.rol,
      };
  
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "1d",
      });

      res.status(200).json({ authToken: authToken });
    } catch (error) {
      next(error);
    }
  });

  // GET "/api/auth/verify" => Verificamos que en todo momento el usuario tiene activo un token valido
router.get("/verify", verifyToken, (req, res)=>{
    // console.log(req.payload)
    res.json(req.payload)
})

module.exports = router