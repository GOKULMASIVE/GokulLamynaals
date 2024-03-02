const { Product, SubProduct } = require("../Model/product");

module.exports.postProduct = (clientId, receivedData, next, callback) => {
  try{
    let data = new Product(receivedData);
  data["clientId"] = clientId
  data.save(function (err, response) {
    if (err) {
      callback(err);
    } else {
      callback(null, response);
    }
  });
  }catch(err){
    next(err);
  }
  
};

// Changes by Arun
module.exports.createSubProduct = (clientId, receivedData, next, callback) => {
  try{
      let data = new SubProduct(receivedData);
  data["clientId"] = clientId

  data.save(function (err, response) {
    if (err) {
      callback(err);
    } else {
      callback(null, response);
    }
  });
  }catch(err){
    next(err);
  }
  
};

module.exports.getProduct = (clientId, isAscending, next, callback) => {
  try{
    Product.find({ clientId: clientId })
    .sort(isAscending?{ product: 1 }:{})
    .exec(function (err, response) {
      //sort added bu gokul...
      if (err) {
        callback(err);
      } else {
        //console.log("node",response)
        callback(null, response);
      }
    });
  }catch(err){
    next(err);
  }
  
  
};

// Changes by Arun

module.exports.getSubProduct = (clientId,isAscending, next, callback) => {
  try{
      // added by gokul..
  let sortData = {};
  if (isAscending === "combineData") {
    sortData={product:isAscending?1:0}
  }else{
    sortData={subProduct:isAscending?1:0}
  }
  // Changes by Arun
  SubProduct.aggregate([
    {
      $match: {
        clientId: clientId,
      },
    },
    {
      $lookup: {
        from: "product",
        let: { productID: { $toObjectId: "$productID" } },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$productID"] } } },
          { $project: { _id: 0, product: 1 } },
        ],
        as: "ProductData",
      },
    },
    {
      $unwind: {
        path: "$ProductData",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        subProduct: { $first: "$subProduct" },
        productID: { $first: "$productID" },
        isEnabled: { $first: "$isEnabled" },
        remarks: { $first: "$remarks" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        product: { $first: "$ProductData.product" },
      },
    },
    {
      $project: {
        _id: 1,
        subProduct: 1,
        productID: 1,
        isEnabled: 1,
        remarks: 1,
        createdAt: 1,
        updatedAt: 1,
        product: 1,
      },
    },
  ])
    .sort(sortData)
    .exec(function (err, response) {
      if (err) {
        callback(err);
      } else {
        callback(null, response);
      }
    });
  }catch(err){
    next(err);
  }
  
};

// Changes By Arun
module.exports.getActiveProduct = (clientId,next,callback) => {
  try{
    Product.find({ isEnabled: true }, "_id product", function (err, response) {
    if (err) {
      callback(err);
    } else {
      callback(null, response);
    }
  });
  }catch(err){
    next(err);
  }
  
};

module.exports.putProduct = async (id, receivedData, next, callback) => {
  try {
    if (receivedData.isEnabled === false) {
      const subPro = await SubProduct.find({ productID: id });
      const allSubProductsDisabled = subPro.every((subProduct) => !subProduct.isEnabled);
      if (allSubProductsDisabled) {
        const response = await Product.findByIdAndUpdate({ _id: id }, receivedData);
        console.log("Product updated successfully");
        callback(null, response)
      } else {
        console.log("Not all SubProducts are disabled");
        //callback({ error: "true", message: "Not all SubProducts are disabled" })
        callback(new Error("Need to disable All SubProducts"))
      }
    } else {
      Product.findByIdAndUpdate({ _id: id }, receivedData, function (err, response) {
        if (err) {
          callback(err);
        } else {
          callback(null, response);
        }
      }
      );
    }
  } catch (err) {
    console.error("Error updating product:", err);
    // callback(err, null);
    next(err);
  }
};


// Changes by Arun
module.exports.putSubProduct = (id, receivedData, next, callback) => {
  try{
    SubProduct.findByIdAndUpdate(
    { _id: id },
    receivedData,
    function (err, response) {
      if (err) {
        callback(err);
      } else {
        callback(null, response);
      }
    }
  );
  }catch(err){
    next(err);
  }
  
};
// changes by somesh
module.exports.deleteProduct = async(id, next, callback) => {
  try{
    const checkSubProduct = await SubProduct.find({ productID: id });
  console.log(checkSubProduct);
  if (checkSubProduct.length === 0) {
   Product.findByIdAndDelete(id, function (err, response) {  
    if (err) {
      callback(err);
    } else {
      callback(null, response);
    }
  }); 
  }else{
    console.log("Check All the SubProducts are deleted");
    callback(new Error("Check All the SubProducts are deleted"))
   // callback({ error: "true", message: "Check All the SubProducts are deleted" })
  }
  }catch(err){
    next(err);
  }
  
};

// Changes by Arun
module.exports.deleteSubProduct = (id, next, callback) => {
  try{
    SubProduct.findByIdAndDelete(id, function (err, response) {
    if (err) {
      callback(err);
    } else {
      callback(null, response);
    }
  });
  }catch(err){
    next(err);
  }
  
};

module.exports.filterProduct = (clientId,data, next, callback) => {
  try{
     Product.find({$and:[{clientId:clientId},data]}).exec(function (err, response) {
    if (err) {
      callback(err);
    } else {
      callback(null, response);
    }
  });
  }catch(err){
    next(err);
  }
 
};

// // changes by somesh
module.exports.filterSubProduct = (clientId,data, next, callback) => {
  try{
    const isEnabled = data.isEnabled === 'true' ? true : false ;
  SubProduct.aggregate(
    [
      {
        $match: {
          clientId: clientId,
          isEnabled: isEnabled
        }
      },
      {
        $lookup: {
          from: "product",
          let: { productID: { $toObjectId: "$productID" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$productID"] } } },
            { $project: { _id: 0, product: 1 } },
          ],
          as: "ProductData",
        },
      },
      {
        $unwind: {
          path: "$ProductData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          subProduct: { $first: "$subProduct" },
          productID: { $first: "$productID" },
          isEnabled: { $first: "$isEnabled" },
          remarks: { $first: "$remarks" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          product: { $first: "$ProductData.product" },
        },
      },
      {
        $project: {
          _id: 1,
          subProduct: 1,
          productID: 1,
          isEnabled: 1,
          remarks: 1,
          createdAt: 1,
          updatedAt: 1,
          product: 1,
        },
      },
    ],
    function (err, response) {
      if (err) {
        callback(err);
      } else {
        callback(null, response);
      }
    }
  );
  // SubProduct.find({$and:[{clientId:clientId},data]}).exec(function (err, response) {
  //   if (err) {
  //     callback(err);
  //   } else {
  //     callback(null, response);
  //   }
  // });
  }catch(err){
    next(err);
  }
  
};
