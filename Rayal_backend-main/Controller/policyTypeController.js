const service = require('../service/policyTypeService')

module.exports.postPolicyType = (req,res,next) =>{
    var requestData = req.body;
    var clientId = req.headers["clientid"]
    if(!requestData.policyType) {
        return res.status(200).error({error:true , message :"Please Provide Policy Type "})
    }
    service.postPolicyType(clientId,requestData,next, function(error,data) {
        if (error) {
            if(error.code===11000){
                res.status(200).send({error:true,message:"Policy Type already exists"})
            }else{
                res.status(500).send(error)
            }
        }
        else {
            res.status(200).send(data)
        }
    })
}

module.exports.getPolicyType = (req,res,next)=>{
    let requestData = req.data
    var clientId = req.headers["clientid"]
    const isAscending=req.headers["isascending"];
    service.getPolicyType(
      clientId,
      isAscending,
      requestData,
      next, function (error, data) {
        if (error) {
          res.status(500).send(error);
        } else {
          res.status(200).send(data);
        }
      }
    );
}

module.exports.putPolicyType = (req,res,next) =>{
    var id = req.params.id
    var requestData = req.body;
    service.putPolicyType(id,requestData,next, function(error,data){
        if(error) {
            if(error.code === 11000 ){
                res.status(200).send({error : true , message :"Already Policy Type Exists"})
            }
            else {
                res.status(500).send(error)
            }
        }
        else {
            res.status(200).send(data)
        }
    })
}

module.exports.deletePolicyType = (req,res,next) =>{
    var id = req.params.id 
    service.deletePolicytype(id,next, function(error,data){
        if (error){
            res.status(500).send(error)
        }
        else {
            res.status(200).send(data)
        }
    })
}

module.exports.filterPolicyType = (req,res,next) =>{
    var requestData = req.body;
  var clientId = req.headers["clientid"]
    service.filterPolicyType(clientId,requestData,next, function(error,data){
        if(error){
            res.status(500).send(error)
        }
        else {
            res.status(200).send(data)
        }
    })
}