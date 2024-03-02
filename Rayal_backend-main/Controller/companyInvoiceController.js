const service = require('../service/companyInvoiceService')

module.exports.postCompanyInvoice = (req, res,next) => {
    var requestData = req.body;
    service.postCompanyInvoice(requestData, next,function (error, data) {
        if (error) {
            res.status(500).send(error)
        }
        else {
            res.status(200).send(data)
        }
    })
}

module.exports.getCompanyInvoice = (req, res,next) => {
    service.getCompanyInvoice(next,function (error, data) {
        if (error) {
            res.status(500).send(error)
        }
        else {
            res.status(200).send(data)
        }
    })
}

module.exports.putCompanyInvoice = (req, res,next) => {
    var id = req.params.id
    var receivedData = req.body
    service.putCompanyInvoice(id, receivedData, next,function (error, data) {
        if (error) {
            res.status(500).send(error)
        }
        else {
            res.status(200).send(data)
        }
    })
}

module.exports.deleteCompanyInvoice = (req, res,next) => {
    var id = req.params.id
    service.deleteCompanyInvoice(id, next,function (error, data) {
        if (error) {
            res.status(500).send(error)
        }
        else {
            res.status(200).send(data)
        }
    })
}