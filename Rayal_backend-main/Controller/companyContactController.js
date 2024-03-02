const service = require('../service/companyContactService')

module.exports.postCompanyContact = (req, res,next) => {
    var receivedData = req.body;
    var clientId = req.headers["clientid"]
    service.postCompanyContact(clientId,receivedData, next,function (error, data) {
        if (error) {
            if (error.code === 11000) {
                return res.status(200).send({ error: true, message: "Already Exists" })
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

module.exports.getCompanyContact = (req, res,next) => {
    var clientId = req.headers["clientid"]
    service.getCompanyContact(clientId,next,function (error, data) {
        if (error) {
            res.status(500).send(error)
        }
        else {
            res.status(200).send(data)
        }
    })
}

module.exports.putCompanyContact = (req, res,next) => {
    var id = req.params.id;
    var requestData = req.body;
    service.putCompanyContact(id, requestData, next,function (error, data) {
        if (error) {
            if (error.code === 11000) {
                return res.status(200).send({ error: true, message: "Already Exists" })
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

module.exports.deleteCompanyContact = (req, res,next) => {
    var id = req.params.id
    service.deleteCompanyContact(id, next,function (error, data) {
        if (error) {
            res.status(500).send(error)
        }
        else {
            res.status(200).send(data)
        }
    })
}

module.exports.searchCompanyContact = (req, res,next) => {
    const clientId=req.headers["clientid"];
    var requestData = req.body;
    service.searchCompanyContact(clientId,requestData, next,function (error, data) {
        if (error) {
            res.status(500).send(error)
        }
        else {
            res.status(200).send(data)
        }
    })
}