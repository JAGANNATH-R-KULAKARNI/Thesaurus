const User=require('../models/user');
const jwt=require('jsonwebtoken'); // for generating the signed token
const expressjwt=require('express-jwt'); // for authorization check
const {errorHandler}=require('../helpers/dbErrorHandler');

exports.signup = (req,res)=>{
    console.log(req.body);
    const user=new User(req.body);
    
    user.save((err,user)=>{
      if(err){
          return res.status(400).json({
              err : errorHandler(err)
          }); 
      }
  
      user.salt=undefined
      user.hashed_password=undefined

      res.json({
          user
      });
  });
};

exports.signin= (req,res) =>{

    const {email,password}=req.body;
    User.findOne({email},(err,user)=>{
        if(err || !user){
            return res.status(400).json({
                err :  'user with this email does not exits so signup before login'
            });
        }
        
        if(!user.authenticate(password)){
            return res.status(401).json({
                error : 'Email and password does not match'
            })
        }
        //generating token
        const token=jwt.sign({_id : user._id},process.env.JWT_SECRET);

        res.cookie('t',token,{expire : new Date()+9999});

        const {_id,name,email,role}=user;

        return res.json({
            token,
            user : {
                _id,email,name,role
            }
        });
    })
}

exports.signout = (req,res) =>{
    res.clearCookie('t');
    res.json({
        message : 'Signed out successfully'
    })
}


exports.requireSignin=expressjwt({
    secret : process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty : "auth"
});

exports.isAuth = (req,res,next) =>{
    let user=req.profile && req.auth && req.profile._id == req.auth._id;

    if(!user){
        return res.status(403).json({
            error : 'Access denied'
        });
    }

    next()
}

exports.isAdmin= (req,res,next)=>{

    if(req.profile.role === 0){
        return res.status(403).json({
            error : 'You are not Admin access denied'
        });

        next()
    }
}