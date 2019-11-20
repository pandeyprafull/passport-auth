const jwt = require('jsonwebtoken');


const decodeToken = (req, res, next) =>{
    jwt.verify(req.token, process.env.SECRET, (err, authData)=>{
        if(authData){
            return next();
        }  
        else{
            return res.status(403).json({message: "Forbidden error / unAuthorized user", status: 403})   
        }
    })
}

module.exports = decodeToken;