const jwt = require("jsonwebtoken")

function verifyTokens(req, res, next){
    // console.log(req.headers)

    try {
        
        const tokenArr = req.headers.authorization.split(' ')
        const token = tokenArr[1]
        const payload = jwt.verify(token, process.env.TOKEN_SECRET)
        // console.log(payload)
        req.payload = payload
        next()
    } catch (error) {
        res.status(401).json({message:"Ande vas? Tira pa lla bobo"})
    }

}

module.exports = verifyTokens