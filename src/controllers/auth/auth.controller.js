const userModel = require("../../models/user.model");
const emailService = require("../../services/email.service")
const jwt = require("jsonwebtoken");

async function userRegister(req,res){
    try{
        const {email,name,password} = req.body;
        const isEmailExits = await userModel.findOne({email});
        if(isEmailExits){
            return res.status(422).json({message:"Email exists"});
        }

        const user = await userModel.create({email,name,password});
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"3d"});
        res.cookie("token",token);

        res.status(201).json({
            message:"User registered",
            user:{
                id:user._id,
                email:user.email,
                name:user.name
            }
        })
        await emailService.sendRegistrationEmail(user.email,user.name);
    }catch(err){
        res.status(400).json({message:err.message});
    }

}

async function userLogin(req,res){
    try{
        const {email,password} = req.body;
        const user = await userModel.findOne({email}).select("+password");
        if(!user){
            return res.status(403).json({message:"Please enter valid creds."})
        }

        const passwordCheck = await user.comparePassword(password);
        if(!passwordCheck){
            return res.status(403).json({message:"Please enter valid credentials."});
        }

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"3d"});
        res.cookie(token);
        res.status(200).json({message:`logged in succesfully`, user});

       
    }catch(err){
        res.status(400).json({message:err.message});
    }
}
module.exports={userRegister,userLogin}