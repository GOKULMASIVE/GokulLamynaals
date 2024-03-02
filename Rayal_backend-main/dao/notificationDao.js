const notification = require('../Model/notification')

module.exports.postNotification = (receivedData , next,callback) =>{
    try{
        let data = new notification(receivedData);
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

module.exports.getNotification = (next,callback) =>{
    try{
        notification.find(function (err, response) {
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

module.exports.putNotification =(id , receivedData , next,callback) =>{
    try{
        notification.findByIdAndUpdate(
          id,
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
    
}

module.exports.deleteNotification = (id ,next,callback) =>{
    try{
        notification.findByIdAndDelete(id, function (error, response) {
          if (error) {
            callback(error);
          } else {
            callback(null, response);
          }
        });
    }catch(err){
        next(err);
    }
    
}