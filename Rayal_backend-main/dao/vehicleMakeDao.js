const { SubProduct } = require("../Model/product");
const vehicleMakeTable = require("../Model/vehicleMake");

module.exports.postVehicleMake = async (
  clientId,
  receivedData,
  next,
  callback
) => {
  try {
    let docs = [];
    const product = receivedData.product;
    const productId = receivedData.productID;
    if (product.length) {
      product.map((n, i) => {
        docs.push({
          product: n,
          productID: productId[i],
          vehicleMake: receivedData.vehicleMake,
          remarks: receivedData.remarks,
          updatedAt: receivedData.updatedAt,
          clientId,
        });
      });
    }

    vehicleMakeTable.insertMany(docs, function (error, response) {
      if (error) {
        callback(error);
      } else {
        callback(null, response);
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getVehicleMake = (clientId, isAscending, next, callback) => {
  try {
    vehicleMakeTable
      .find({ clientId: clientId })
      .sort(isAscending ? { vehicleMake: 1 } : {})
      .exec(function (err, data) {
        if (err) {
          callback(err);
        } else {
          callback(null, data);
        }
      });
  } catch (err) {
    next(err);
  }
};

module.exports.putVehicleMake = (id, receivedData, next, callback) => {
  try {
    vehicleMakeTable.findByIdAndUpdate(
      { _id: id },
      receivedData,
      function (err, data) {
        if (err) {
          callback(err);
        } else {
          callback(null, data);
        }
      }
    );
  } catch (err) {
    next(err);
  }
};

module.exports.deleteVehicleMake = (id, next, callback) => {
  try {
    vehicleMakeTable.findOneAndRemove({ _id: id }).exec(function (err, data) {
      if (err) {
        callback(err);
      } else {
        callback(null, data);
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports.filterVehicleMake = (clientId, data, next, callback) => {
  try {
    vehicleMakeTable
      .find({
        $and: [
          {
            clientId: clientId,
          },
          data,
        ],
      })
      .exec(function (err, response) {
        if (err) {
          callback(err);
        } else {
          callback(null, response);
        }
      });
  } catch (err) {
    next(err);
  }
};
