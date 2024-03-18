const Users = require('../models/user.module');
const bcrypt = require('bcrypt');
const jwt = require( 'jsonwebtoken' );
const SECRET_KEY = "NOTESAPI"

const signup = async(req,res)=>{
    const {username,email,password} = req.body;
    try{
        const existingUser = await Users.findOne({email:email});
        if (existingUser) return res.status(400).json({msg:"User already exists"});

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await Users.create({
            username:username,
            email:email,
            password:hashedPassword
        });

        const token = jwt.sign({email:result.email,id:result._id},SECRET_KEY);
         res.status(201).json({user:result,token:token})
    }catch(err){
        console.log(err);
        res.status(500).json({msg:'Something went wrong'});
    }
}

const signin = async(req,res) =>{
    const {email,password}= req.body;
    try{
        const existingUser = await Users.findOne({email:email});
        if(!existingUser){
            return res.status(400).json({message:"User not found"});
        }
        const matchPassword = await bcrypt.compare(password,existingUser.password);
        if(!matchPassword){
            return rs.status(400).json({message:"Invalid Credentials"});
        }
        const token = jwt.sign({email:existingUser.email,id:existingUser._id},SECRET_KEY);
        res.status(201).json({user:result,token:token})
    }catch(err){
        console.log(err);
        res.status(500).json({msg:'Something went wrong'});
    }
}

module.exports = {signup,signin}