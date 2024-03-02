const dao = require('../dao/bookingCode')

module.exports.postBookingCode = (clientId,data,next, callback) => {
    dao.postBooking(clientId,data,next, function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, { error: false, data: result, message: "Saved Successfully" })
        }
    })
}

module.exports.getBooking = (clientId, isAscending, data,next, callback) => {
  dao.getBooking(clientId, isAscending, {}, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

module.exports.putBooking = (id, data,next, callback) => {
    dao.putBooking(id, data,next, function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, { error: false, data: result, message: "Updated Successfully" })
        }
    })
}

module.exports.deleteBooking = (id,next, callback) => {
    dao.deleteBooking(id, next,function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, { error: false, data: result, message: "Deleted Successfully" })
        }
    })
}

module.exports.filterBookingCode = (clientId,data, next,callback) => {
    dao.filterBookingCode(clientId,data,next, function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, ({ error: null, data: result, message: null }))
        }
    })
}

// Changes By Somesh

module.exports.createSubBookingCode = (clientId , data, next,callback) => {
    dao.createSubBookingCode(clientId,data,next, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, {
                error: false,
                data: result,
                message: "Saved Successfully",
            });
        }
    });
};

module.exports.getSubBookingCode = (clientId, isAscending, next,callback) => {
  dao.getSubBookingCode(clientId, isAscending, next,function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, { error: false, data: result, message: null });
    }
  });
};

module.exports.getActiveBookingCode = (next,callback) => {
    dao.getActiveBookingCode(next,function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, { error: false, data: result, message: null });
        }
    });
}

module.exports.putSubBookingCode = (id, data,next, callback) => {
    dao.putSubBookingCode(id, data,next, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, {
                error: false,
                data: result,
                message: "Updated Successfully",
            });
        }
    });
};

module.exports.deleteSubBookingCode = (id,next, callback) => {
    dao.deleteSubBookingCode(id, next,function (err, result) {
      if (err) {
        callback(err);
      } else {
        callback(null, {
          error: false,
          data: result,
          message: "Deleted Successfully",
        });
      }
    });
  };

  module.exports.filterSubBookingCode = (clientId,data, next,callback) => {
    dao.filterSubBookingCode(clientId,data,next, function (err, result) {
        if (err) {
            callback(err)
        }
        else {
            callback(null, ({ error: null, data: result, message: null }))
        }
    })
}
  