var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var tableschema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    mobileNumber: {
        type: String,
    },
    address:{
        addressLine1:{
            type: String,
        },
        addressLine2:{
            type: String,
        },
        city:{
            type: String,
        },
        state:{
            type: String,
        },
        country:{
            type: String,
        },
        zipcode:{
            type: String,
        }
    }

});


var userTable = mongoose.model('contactUs', tableschema, 'contactUs');
module.exports = userTable;