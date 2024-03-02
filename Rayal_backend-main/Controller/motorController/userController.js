const userService=require('../../service/motorService/userService')
const sendSMS=require('../../configuration/sendSms')
const otpGenerator = require('otp-generator')
const validator = require("email-validator");
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const users=require('../../Model/motorUsers')

const badRequest={
    error:true,
    message:"Bad Request"
}
const invalidmobile={
    error:true,
    message:"Invalid Mobile Number"
}
var somethingWentWrong={
    error:true,
    message:"Somthing Went Wrong",
}

const createUser =async (req,res)=>{
    var receivedData=req.body
    var validateNumber=new RegExp('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$')
    if(!validateNumber.test(receivedData.mobileNumber)){
        return res.status(400).send(invalidmobile)
    }
    if(!validator.validate(receivedData.email) ){
        return res.status(400).send({
            error:true,
            message:"Invalid Email"
        })
    }
    else{
        let lastCounter=await users.findOne({})
        if(lastCounter?.lastCounter){
            receivedData.UID=Number(lastCounter.lastCounter)+1
            receivedData.lastCounter=Number(lastCounter.lastCounter)+1
        }
        let otp=await otpGenerator.generate(5, {lowerCaseAlphabets:false,upperCaseAlphabets: false, specialChars: false });
        console.log(otp)
        var sendData={
            mobileNumber:receivedData.mobileNumber,
            otp:otp,
            name:receivedData.name
        }
        let sms=await sendSMS.sendOtpMobile(sendData)
        receivedData.otp=otp
        // receivedData.otp="54321"
        receivedData.otpSentAt=new Date()
        bcrypt.hash(receivedData.password, saltRounds, function (err, hash) {
            receivedData.password=hash
            userService.createUser(receivedData,function(err,data){
                if(err){
                    somethingWentWrong.err=err
                    if(err.code==11000){
                        return res.status(200).send({error:true,message:"Mobile Number Already Exists"})
                    }else{
                        return res.status(500).send(somethingWentWrong)
                    }
                }else{
                    users.updateMany({},{$set:{lastCounter:Number(lastCounter.lastCounter)+1}})
                    return res.status(200).send({
                        error:false,
                        message:"Otp Sent To your Mobile"
                    })
                }
            })
        })
    }
}

const getOtp =async (req,res)=>{
    var receivedData=req.body
    var validateNumber=new RegExp('^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$')
    if(!validateNumber.test(receivedData.mobileNumber)){
        return res.status(400).send(invalidmobile)
    }
    else{
        let otp=await otpGenerator.generate(5, {lowerCaseAlphabets:false,upperCaseAlphabets: false, specialChars: false });
        console.log(otp)
        var sendData={
            mobileNumber:receivedData.mobileNumber,
            otp:otp,
            name:receivedData.name
        }
        let sms=await sendSMS.sendOtpMobile(sendData)
        receivedData.otp=otp
        // receivedData.otp="54321"
        return res.status(200).send({
            error:false,
            message:"Otp Sent To your Mobile",
            otp:otp
        })
    }
}

const verifyOtp =async(req,res)=>{
    var receivedData=req.body
    userService.getuserByMobileNumberOrEmail(receivedData,function(err,data){
        if(err){
            somethingWentWrong.err=err
            res.status(500).send(somethingWentWrong)
        }else if(data){
            if(receivedData.otp==data.otp){
                userService.createToken(data,function(err,tokendata){
                    if(err){
                        res.status(500).send(somethingWentWrong)
                    }else{
                        let sendData={
                            mobileNumber:receivedData.mobileNumber,
                            otp:"025528525"
                        }
                        userService.updateuserByMobileNumber(sendData,function(err,data){
                            if(err){
                                res.status(500).send(somethingWentWrong)
                            }else{
                                res.status(200).send({ error: false, data: tokendata, message: null });
                            }
                        })
                    }
                })
            }else{
                res.status(200).send({
                    error:true,
                    message:"InValid Otp"
                })
            }
        }else{
            res.status(200).send({
                error:true,
                message:"User Not Found"
            })
        }
    })
}

const login =async(req,res)=>{
    var receivedData=req.body
    userService.getuserByMobileNumberOrEmail(receivedData,function(err,data){
        if(err){
            somethingWentWrong.err=err
            res.status(500).send(somethingWentWrong)
        }else if(data){
            bcrypt.compare(req.body.password, data.password, function (err, result) {
                if(err){
                    res.status(500).send(somethingWentWrong)
                }else if(result){
                    userService.createToken(data,function(err,tokendata){
                        if(err){
                            res.status(500).send(somethingWentWrong)
                        }else{
                            res.status(200).send({ error: false, data: tokendata, message: null });
                        }
                    })
                }else if (!result) {
                    res.status(200).send({ error: true, data: null, message: 'Login Fail Invalid Password' });
                } else {
                    res.status(200).send({ error: true, data: null, message: 'Something Went Wrong in Login' });
                }
            })
            
        }else{
            res.status(200).send({
                error:true,
                message:"User Not Found"
            })
        }
    })
}

const weblogin =async(req,res)=>{
    var receivedData=req.body
    userService.getuserByMobileNumberOrEmail(receivedData,function(err,data){
        if(err){
            somethingWentWrong.err=err
            res.status(500).send(somethingWentWrong)
        }else if(data && data.isAdmin){
            bcrypt.compare(req.body.password, data.password, function (err, result) {
                if(err){
                    res.status(500).send(somethingWentWrong)
                }else if(result){
                    userService.createToken(data,function(err,tokendata){
                        if(err){
                            res.status(500).send(somethingWentWrong)
                        }else{
                            res.status(200).send({ error: false, data: tokendata, message: null });
                        }
                    })
                }else if (!result) {
                    res.status(200).send({ error: true, data: null, message: 'Login Fail Invalid Password' });
                } else {
                    res.status(200).send({ error: true, data: null, message: 'Something Went Wrong in Login' });
                }
            })
            
        }else{
            res.status(200).send({
                error:true,
                message:"User Not Found"
            })
        }
    })
}
const changePassword =async(req,res)=>{
    var receivedData=req.body
    bcrypt.hash(receivedData.password, saltRounds, function (err, hash) {
        receivedData.password=hash
        receivedData.userId=req.userId
        userService.updateuserByuserId(receivedData,function(err,data){
            if(err){
                somethingWentWrong.err=err
                return res.status(500).send(somethingWentWrong)
            }else{
                return res.status(200).send({
                    error:false,
                    message:"Updated Successfully"
                })
            }
        })
    })
}

const forgotPassword =async(req,res)=>{
    var receivedData=req.body
    let otp=await otpGenerator.generate(6, {lowerCaseAlphabets:false,upperCaseAlphabets: false, specialChars: false });
    await userService.getuserByMobileNumberOrEmail(receivedData,function(err,data){
        if(err){
            somethingWentWrong.err=err
            res.status(500).send(somethingWentWrong)
        }else if(data){
            console.log(otp)
            var sendData={
                mobileNumber:receivedData.mobileNumber,
                otp:"54321",
                name:data.name
            }
            sendSMS.sendOtpMobile(sendData)
            userService.updateuserByMobileNumber(sendData,function(err,data){
                if(err){
                    somethingWentWrong.err=err
                    return res.status(500).send(somethingWentWrong)
                }else{
                    return res.status(200).send({
                        error:false,
                        message:"Otp Sent To your Mobile"
                    })
                }
            })
        }else{
            return res.status(200).send({
                error:false,
                message:"User Not Found ! Invalid Mobile/Email"
            })
        }
    })
}




module.exports={
    createUser,
    login,
    forgotPassword,
    changePassword,
    verifyOtp,
    weblogin,
    getOtp
}