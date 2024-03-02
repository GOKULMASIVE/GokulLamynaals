const { Menu } = require("../Model/roleMenu");

// Changes by Arun
module.exports.createMenu = (receivedData, next, callback) => {
  try{
    let menu = new Menu(receivedData);

  menu.save(function (err, response) {
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
