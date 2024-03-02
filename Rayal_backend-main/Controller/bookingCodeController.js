const service = require("../service/bookingCodeService");

module.exports.postBooking = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  if (!requestData.bookingCode) {
    return res
      .status(200)
      .send({ error: true, message: "Please Provide Booking Code " });
  }
  service.postBookingCode(clientId, requestData,next, function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res.status(200).send({ error: true, message: "Booking Code already " });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.getBooking = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  const isAscending=req.headers["isascending"]
  service.getBooking(
    clientId,
    isAscending,
    requestData,
    next,
    function (error, data) {
      if (error) {
        res.status(500).send(error);
      } else {
        res.status(200).send(data);
      }
    }
  );
};

module.exports.putBooking = (req, res,next) => {
  var id = req.params.id;
  var requestData = req.body;
  console.log(requestData);
  // if (!requestData.bookingCode) {
  //   return res
  //     .status(200)
  //     .send({ error: true, message: "Please Provide Booking Code " });
  // }
  service.putBooking(id, requestData,next, function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res
          .status(200)
          .send({ error: true, message: "Booking Code Already Exists" });
      } else {
        res.status(500).send({ error: true, message: error.message });
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.deleteBooking = (req, res,next) => {
  var id = req.params.id;
  service.deleteBooking(id, next,function (error, data) {
    if (error) {
      res.status(500).send({ error: true, message: error.message });
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.filterBookingCode = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  service.filterBookingCode(clientId, requestData, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

// changes by Somesh
module.exports.createSubBookingCode = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  if (!requestData.bookingCodeId) {
    return res
      .status(200)
      .send({ error: true, message: "Please Provide Booking Code " });
  }
  if (!requestData.subBookingCode) {
    return res
      .status(200)
      .send({ error: true, message: "Please Provide Sub Booking Code " });
  }
  service.createSubBookingCode(clientId, requestData, next,function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res
          .status(200)
          .send({ error: true, message: "SubBooking Code already exists" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.getSubBookingCode = (req, res,next) => {
  var clientId = req.headers["clientid"];
  const isAscending=req.headers["isascending"]
  service.getSubBookingCode(clientId, isAscending, next,function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.getActiveBookingCode = (req, res,next) => {
  service.getActiveBookingCode(next,(err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.putSubBookingCode = (req, res,next) => {
  var id = req.params.id;
  var requestData = req.body;
  // if (!requestData.subBookingCode) {
  //   return res
  //     .status(200)
  //     .send({ error: true, message: "Please Provide Sub Booking Code " });
  // }
  service.putSubBookingCode(id, requestData, next,function (error, data) {
    if (error) {
      if (error.code === 11000) {
        res
          .status(200)
          .send({ error: true, message: "Sub BookingCode Already Exists" });
      } else {
        res.status(500).send(error);
      }
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.deleteSubBookingCode = (req, res,next) => {
  var id = req.params.id;
  service.deleteSubBookingCode(id,next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};

module.exports.filterSubBookingCode = (req, res,next) => {
  var requestData = req.body;
  var clientId = req.headers["clientid"];
  service.filterSubBookingCode(clientId, requestData,next, function (error, data) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.status(200).send(data);
    }
  });
};
