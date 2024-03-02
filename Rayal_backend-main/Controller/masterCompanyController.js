const service = require('../service/masterCompanyService')

module.exports.postMasterCompany = (req, res,next) => {
    var requestData = req.body
    var clientId = req.headers["clientid"]

    if (!requestData.masterCompanyName) {
        return res.status(200).send({ error: true, message: "Please Provide Company Name" })
    }
    service.postMasterCompany(clientId,requestData,next, function (error, data) {
        if (error) {
            if (error.code === 11000) {
                res.status(200).send({ error: true, message: "Master Company Name Already Exists" })
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

module.exports.getMasterCompany = (req, res,next) => {
      var clientId = req.headers["clientid"]
    service.getMasterCompany(clientId,next,function (error, data) {
        if (error) {
            res.status(500).send(error)
        }
        else {
            res.status(200).send(data)
        }
    })
}

module.exports.putMasterCompany = (req, res,next) => {
    var id = req.params.id
    var receivedData = req.body
    service.putMasterCompany(id, receivedData, next,function (error, data) {
        if (error) {
            if (error.code === 11000) {
                res.status(200).send({ error: true, message: "Master Company Name Already Exists" })
            }
            else {
                res.status(500).send(error)
            }
        }
        else {
            const options = {
                timeZone: 'Asia/Kolkata',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true, // Use 12-hour format with AM/PM
            };
            data.updatedAt = new Date();
            console.log("UpdatedAt : ",data.updatedAt.toLocaleString('en-IN', options));
            res.status(200).send(data)
        }
    })
}

module.exports.deleteMasterCompany = (req, res,next) => {
    var id = req.params.id
    service.deleteMasterCompany(id, next,function (error, data) {
        if (error) {
            res.status(500).send(error)
        }
        else {
            res.status(200).send(data)
        }
    })
}

module.exports.filterMasterCompany = (req, res,next) => {
    var requestData = req.body;
  var clientId = req.headers["clientid"]
    service.filterMasterCompany(clientId,requestData, next,function (error, data) {
        if (error) {
            res.status(500).send(error)
        }
        else {
            res.status(200).send(data)
        }
    })
}