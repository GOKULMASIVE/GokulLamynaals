const service = require ('../service/notificationService')

module.exports.postNotification = (req,res,next) =>{
    var requestData = req.body
    if(!requestData.notification){
        return res.status(200).send({error : true , message : "Please Provide Notification"})
    }
    service.postNotification(requestData,next,function(error,data){
        if(error){
            if(error.code===11000){
                res.status(200).send({error:true , message :"Message Already Exists"})
            }
            else {
                res.status(500).send(error)
            }
        }
        else {
            res.status(200).send(data)
        }
    })
};

module.exports.getNotification = (req,res,next) =>{
    service.getNotification(next,function(error,data){
        if(error){
            res.status(500).send(error)
        }
        else{
            res.status(200).send(data)
        }
    })
}

module.exports.putNotification = (req, res,next) =>{
    var id = req.params.id
    var requestData = req.body
    service.putNotification(id,requestData,next,function(error,data){
        if(error){
            if(error.code){
                res.status(200).send({error : true , message :"Notification Already Exists"})
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

module.exports.deleteNotification = (req,res,next) =>{
    var id = req.params.id
    service.deleteNotification(id,next,function(error , data){
        if(error){
            res.status(500).send(error)
        }
        else {
            res.status(200).send(data)
        }
    })
}