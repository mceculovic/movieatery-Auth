const jwt = require("jsonwebtoken")
require('dotenv').config();


module.exports =  function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.status(401).json({ msg: "Token not provided!" });
    try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();

    }catch(e){
        res.status(403).json({msg: token});
    }
}