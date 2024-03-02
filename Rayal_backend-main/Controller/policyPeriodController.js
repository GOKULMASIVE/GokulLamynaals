const service = require('../service/policyPeriodService')

module.exports.postPolicyPeriod = (req, res, next) => {
    if (!req.body.policyPeriod) {
        return res.status(200).send({ error: true, message: 'Please Provide Policy Period' });
    }
    var requestData = req.body;
    var clientId = req.headers["clientid"]
    service.postPolicyPeriod(clientId,requestData, next, function (error, data) {
        if (error) {
            if (error.code === 11000) {
                res.status(200).send({ error: true, message: "Policy Period already exists" })
            } else {
                res.status(500).send(error)
            }
        }
        else {
            res.status(200).send(data)
        }

    })
}

module.exports.getPolicyPeriod = (req,res,next)=>{
    let requestData = req.body
    var clientId = req.headers["clientid"]
    service.getPolicyPeriod(clientId,requestData,next, function(error,data){
        if (error){
            res.status(500).send(error)
        }
        else {
            res.status(200).send(data)
        }
    })
}


module.exports.putPolicyPeriod = (req, res, next) => {
    var id = req.params.id
    var receivedData = req.body
    service.putPolicyPeriod(id, receivedData, next, function (error, data) {
        if (error) {
            if (error.code === 11000) {
                res.status(200).send({ error: true, message: "Already Policy Period Exists" })
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

module.exports.deletePolicyPeriod = (req, res, next) => {
    var id = req.params.id
    service.deletePolicyPeriod(id, next, function (error, data) {
        if (error) {
            res.status(500).send(error)
        }
        else {
            res.status(200).send(data)
        }
    })
}

module.exports.filterPolicyPeriod = (req, res, next) => {
    var requestData = req.body;
  var clientId = req.headers["clientid"]
    service.filterPolicyPeriod(clientId,requestData, next, function (error, data) {
        if (error) {
            res.status(500).send(error)
        }
        else {
            res.status(200).send(data)
        }
    })
}