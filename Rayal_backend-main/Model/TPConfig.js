var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var tableschema = new Schema({
    twoWheeler:{
        oneYearTp:{
            lessthan75:{type:Number},
            lessthan150:{type:Number},
            lessthan350:{type:Number},
            greaterthan350:{type:Number},
        },
        fiveYearTp:{
            lessthan75:{type:Number},
            lessthan150:{type:Number},
            lessthan350:{type:Number},
            greaterthan350:{type:Number},
        }
    },
    threeWheelerGCV:{
        TP:{type:Number}
    },
    threeWheelerPCV:{
        TP:{type:Number},
        perPassenger:{type:Number}
    },
    privateCar:{
        oneYearTp:{
            lessthan1000:{type:Number},
            lessthan1500:{type:Number},
            greaterthan1500:{type:Number}
        },
        threeYearTp:{
            lessthan1000:{type:Number},
            lessthan1500:{type:Number},
            greaterthan1500:{type:Number}
        }
    },
    taxi:{
        lessthan1000:{
            TP:{type:Number},
            perPassenger:{type:Number}
        },
        lessthan1500:{
            TP:{type:Number},
            perPassenger:{type:Number}
        },
        greaterthan1500:{
            TP:{type:Number},
            perPassenger:{type:Number}
        }
    },
    bus:{
        TP:{type:Number},
        perPassenger:{type:Number}
    },
    schoolBus:{
        TP:{type:Number},
        perPassenger:{type:Number}
    },
    morethanThreeWheelGCV:{
        upto7500:{type:Number},
        upto12000:{type:Number},
        upto20000:{type:Number},
        upto40000:{type:Number},
        above40000:{type:Number},
    },
    miscellaneous:{
        agritracterAndOther:{
            TP:{type:Number}
        }
    }


});


var userTable = mongoose.model('TPConfig', tableschema, 'TPConfig');
module.exports = userTable;