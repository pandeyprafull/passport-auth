// Format of token ------> Authorization : Bearer <Token> 

function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization']
    //check it is not undefined

    if(typeof bearerHeader !== 'undefined'){
       //split at the space
       const bearer = bearerHeader.split(' ');  // ['bearer', '<token>']
       console.log(bearer)
       //get the token
       const bearerToken = bearer[1];
       //set the token
       req.token = bearerToken
       //next middleware
      return next();
    }
    else{
       return res.status(401).json({message: "Forbidden ", status: 401})
    }
}

module.exports = verifyToken