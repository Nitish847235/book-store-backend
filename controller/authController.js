
const User = require('../model/user')
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../services/auth');



const register = async(req,res)=>{
    try {
        let {phone,email,password} = req.body;
        if(!email && !phone){
            return res.badRequest({message : "Insufficient request parameters! email or phone is required"})
        }
        const data = new User({
            ...req.body
        })

        if(req.body.email){
            let found = await User.findOne({email:email});
            if(found){
                return res.validationError({message : `${email} already exists.Unique email are allowed.`})
            }
        }
        if(req.body.phone){
            let found = await User.findOne({phone:phone});
            if(found){
                return res.validationError({message : `${phone} already exists.Unique phone are allowed.`})
            }
        }

        const result = await User.create(data);

        return res.success({data:result})
    } catch (error) {
        return res.internalServerError({data:error.message})
    }
}

const login = async(req,res)=>{
    try {
        let {username,password} = req.body;
        if(!username){
            return res.badRequest({message : "Insufficient request parameters! email or phone is required"})
        }
        if(!password){
            return res.badRequest({message : "Insufficient request parameters! password is required"})
        }

        let check;

        if(Number(username)){
            check = {phone:username}
        }
        else{
            check = {email:username}
        }

        let user = await User.findOne(check)

        if(!user){
            return res.recordNotFound({message:"User doesn't exists"})
        }

        if(password){
            let checkPassword = user.isPasswordMatch(password);
            if(!checkPassword){
                return res.badRequest({message:"Incorrect Password"})
            }
        }

        let userData = user.toJSON();

        let token =  jwt.sign({userId:userData.id,email:userData.email},process.env.JWT_SCERET,{expiresIn:10000*60})

        let result = {...userData,token}
        
        return res.success({data:result})
    } catch (error) {
        return res.internalServerError({data:error.message})
    }
}

const googleLogin  = async(req,res)=>{
    try {
        const {credentials} = req.body;
        console.log(credentials);
        if(!credentials){
            return res.badRequest({message : "Insufficient credentials"})
        }
        const check = await verifyToken(credentials)

        console.log(check);
        let objVal = {
            name: check.name,
            email: check.email,
            picture: check.picture
        }
        let user = await User.findOne({email:check.email})
        if(!user){
            user = await User.create(objVal)
        }
        let userData = user.toJSON();

        let token =  jwt.sign({userId:userData.id,email:userData.email},process.env.JWT_SCERET,{expiresIn:10000*60})

        let result = {...userData,token}
        
        return res.success({data:result})
    } catch (error) {
        console.log(error);
    }
}

module.exports = {register,login,googleLogin};