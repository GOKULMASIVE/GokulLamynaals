const dao = require('../dao/notificationDao')

module.exports.postNotification = (data, next,callback) => {
    dao.postNotification(data, next,function (error, result) {
        if (error) {
            callback(error)
        }
        else {
            callback(null, ({ error: false, data: result, message: "Saved Successfully" }))
        }
    })
}

module.exports.getNotification = (next,callback) => {
    dao.getNotification(next,function (error, result) {
        if (error) {
            callback(error)
        }
        else {
            callback(null, ({ error: false, data: result, message: null }))
        }
    })
}

module.exports.putNotification = (id, data, next,callback) => {
    dao.putNotification(id, data, next,function (error, result) {
        if (error) {
            callback(error)
        }
        else {
            callback(null, ({ error: false, data: result, message: "Updated Successfully" }))
        }
    })
}

module.exports.deleteNotification = (id, next,callback) => {
    dao.deleteNotification(id,next, function (error, result) {
        if (error) {
            callback(error)
        }
        else {
            callback(null, ({ error: false, data: result, message: "Deleted Successfully" }))
        }
    })
}