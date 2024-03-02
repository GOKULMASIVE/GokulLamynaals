const contactUs=require('../../Model/contactUs')
const TPConfig=require('../../Model/TPConfig')

const getContactUs =async(next,callback)=>{
    try{
        contactUs.findOne({}, function (err, data) {
          if (err) {
            callback(err);
          } else {
            callback(null, data);
          }
        });
    }catch(err){
        next(err);
    }
    
}

const postContactUs =async(receivedData,next,callback)=>{
    try{
        let data = new contactUs(receivedData);
        data.save(function (err, data) {
          if (err) {
            callback(err);
          } else {
            callback(null, data);
          }
        });
    }catch(err){
        next(err);
    }
    
}

const updateContactUs =async(receivedData,next,callback)=>{
    try{
        contactUs.findOneAndUpdate(
          { _id: receivedData._id },
          { $set: receivedData },
          function (err, data) {
            if (err) {
              callback(err);
            } else {
              callback(null, data);
            }
          }
        );
    }catch(err){
        next(err);
    }
    
}

const postTP =async(receivedData,next,callback)=>{
    try{
        let data = new TPConfig(receivedData);
        data.save(function (err, data) {
          if (err) {
            callback(err);
          } else {
            callback(null, data);
          }
        });
    }catch(err){
        next(err);
    }
    
}

const updateTP =async(receivedData,next,callback)=>{
    try{
        TPConfig.findOneAndUpdate(
          { _id: receivedData._id },
          { $set: receivedData },
          function (err, data) {
            if (err) {
              callback(err);
            } else {
              callback(null, data);
            }
          }
        );
    }catch(err){
        next(err);
    }
    
}

const getTP =async(next,callback)=>{
    try{
        TPConfig.findOne({}, function (err, data) {
          if (err) {
            callback(err);
          } else {
            callback(null, data);
          }
        });
    }catch(err){
        next(err);
    }
    
}

module.exports={
    getContactUs,
    postContactUs,
    updateContactUs,
    postTP,
    updateTP,
    getTP
}