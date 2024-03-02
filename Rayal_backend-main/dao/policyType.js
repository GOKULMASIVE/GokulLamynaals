const policyType = require('../Model/policyType')

module.exports.postPolicytype = (clientId,receivedData, next, callback) =>{
    try{
        let data = new policyType(receivedData)
    data["clientId"] = clientId
    data.save(function(err,response){
        if (err){
            callback(err)
        }
        else {
            callback(null,response)
        }
    })
    }catch(err){
        next(err);
    }
    
}

module.exports.getPolicyType = (
  clientId,
  isAscending,
  receivedData,
  next,
  callback
) => {
    try{
        policyType
    .find({ clientId: clientId })
    .sort(isAscending?{ policyType: 1 }:{}) //sort added by gokul...
    .exec(function (err, response) {
      if (err) {
        callback(err);
      } else {
        callback(null, response);
      }
    });
    }catch(err){
        next(err);
    }
  
};

module.exports.putPolicyType = (id,receivedData, next, callback) =>{
    try{
         policyType.findByIdAndUpdate({_id:id},receivedData,function(err,data) {
        if (err) {
            callback(err)
        }
        else {
            callback(null,data)
        }
    })

    }catch(err){
        next(err);
    }
   }

module.exports.deletePolicyType = (id, next, callback) =>{
    try{
        policyType.findByIdAndDelete({_id:id},function(err,response){
        if (err){
            callback(err)
        }
        else {
            callback(null,response)
        }
    })
    }catch(err){
        next(err);
    }
    
}

module.exports.filterPolicyType = (clientId,data, next, callback) =>{
    try{
        policyType.find({$and:[{clientId:clientId},data]}).exec(function(err,response){
        if(err){
            callback(err)
        }
        else {
            callback(null,response)
        }
    })
    }catch(err){
        next(err);
    }
    
}