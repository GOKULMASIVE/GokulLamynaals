const service = require('../service/userInvoiceService')


module.exports.postUserInvoice = (req, res, next) => {
    var requestData = req.body;
    service.postUserInvoice(requestData, next, function (error, data) {
        if (error) {
            res.status(500).send(error)
        }
        else {
            res.status(200).send(data)
        }
    })
}

module.exports.getUserInvoice = (req, res, next) => {
    service.getUserInvoice(next,function (error, data) {
        if (error) {
            res.status(500).send(error)
        }
        else {
            res.status(200).send(data)
        }
    })
}

module.exports.putUserInvoice = (req, res, next) => {
    var id = req.params.id;
    var requestData = req.body;
    service.putUserInvoice(id, requestData, next, function (error, data) {
        if (error) {
            res.status(500).send(error)
        }
        else {
            res.status(200).send(data)
        }
    })
}

module.exports.deleteUserInvoice = (req, res, next) => {
    var id = req.params.id
    service.deleteUserInvoice(id, next, function (error, data) {
        if (error) {
            res.status(500).send(error)
        }
        else {
            res.status(200).send(data)
        }
    })
}