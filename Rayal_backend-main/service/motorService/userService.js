const users=require('../../Model/motorUsers')
const jwt = require('jsonwebtoken');

const createUser=async(receivedData,callback)=>{
    let data=new users(receivedData)
    data.save(function(err,data){
        if(err){
            callback(err)
        }else{
            callback(null,data)
        }
    })
}

const getuserByMobileNumberOrEmail=async(receivedData,callback)=>{
    console.log("Ragavan",receivedData)
    users.findOne({$or:[{mobileNumber:receivedData.mobileNumber},{email:receivedData.email}]},function(err,data){
        if(err){
            callback(err)
        }else{
            callback(null,data)
        }
    })
}  

const updateuserByMobileNumber=async(receivedData,callback)=>{
    users.findOneAndUpdate({mobileNumber:receivedData.mobileNumber},{$set:receivedData},function(err,data){
        if(err){
            callback(err)
        }else{
            callback(null,data)
        }
    })
} 
const updateuserByuserId=async(receivedData,callback)=>{
    users.findOneAndUpdate({_id:receivedData.userId},{$set:receivedData},function(err,data){
        if(err){
            callback(err)
        }else{
            callback(null,data)
        }
    })
} 

async function createToken  (data, callback) {
    var token = jwt.sign({
        id: data._id
    }, process.env.SESSION_tokenSECRET, {
            //expiresIn: 86400
            expiresIn: 86400 // expires in 15 minutes
        });
    var refreshToken = jwt.sign({
        id: data._id
    }, process.env.SESSION_refreshTokenSECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
    var tokens = {
        token: token,
        refreshToken: refreshToken,
        name:data.name,
        email:data.email,
        UID:data.UID,
        isAdmin:data.isAdmin
    }
    if (token == undefined || refreshToken == undefined || token == "" || refreshToken == "") {
        callback(null, { error: true, data: null, message: "unexpected Error" });
    } else {
        callback(null, tokens);
    }
};

module.exports={
    createUser,
    getuserByMobileNumberOrEmail,
    createToken,
    updateuserByMobileNumber,
    updateuserByuserId
}