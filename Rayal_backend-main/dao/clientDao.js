const Client = require('../Model/client')

// module.exports.postClient = (receivedData, callback) => {
//     let data = new Client(receivedData);
//     // data.save(function (err, response) {
//     //     if (err) {
//     //         callback(err);
//     //     } else {
//     //         callback(null, response);
//     //     }
//     // });

// }

module.exports.postClient = (receivedData, next,callback) => {

    try{
         const newData = new Client(receivedData);

         // Check if a client with the same data (excluding case) already exists
         Client.findOne(
           {
             client: { $regex: new RegExp("^" + newData.name + "$", "i") },
           },
           (err, existingClient) => {
             if (err) {
               callback(err);
               console.log(err);
             } else if (existingClient) {
               callback("Client with the same data already exists.");
             } else {
               newData.save((err, response) => {
                 if (err) {
                   callback(err);
                 } else {
                   callback(null, response);
                 }
               });
             }
           }
         );
    }catch(err){
       next(err); 
    }
   
};

module.exports.getClient = (receivedData, next,callback) => {
    try{
        Client.find(receivedData).exec(function (err, data) {
          if (err) {
            callback(err);
          } else {
            callback(null, data);
          }
        });
    }catch(err){
        next(err);
    }
    
};

module.exports.updateClient = (id,receivedData, next,callback) => {
    try{
         Client.findOneAndUpdate({ _id: id }, { $set: receivedData }).exec(
           function (err, data) {
             if (err) {
               callback(err);
             } else {
               callback(null, data);
             }
           }
         );
    }catch(err){
        next(err);
    }
   
};

module.exports.deleteClient = (id, next,callback) => {
    try{
        Client.findOneAndRemove({ _id: id }).exec(function (err, data) {
          if (err) {
            callback(err);
          } else {
            callback(null, data);
          }
        });
    }catch(err){
        next(err);
    }
    
};

