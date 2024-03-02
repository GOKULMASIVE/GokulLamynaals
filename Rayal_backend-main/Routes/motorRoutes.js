const express = require('express');
const apiRoutes = express.Router();


const verifiedUser=require('../configuration/verification')
const userController = require('../Controller/motorController/userController')
const adminControler = require('../Controller/motorController/adminController')
const calcController=require('../Controller/motorController/calcController')

const categries= require('../json/categries')
const oldTwoWheelJson=require('../json/twoWheeler.js').twoWheelers
const newTwoWheelJson=require('../json/newTwoWheeler.js').newTwoWheeler
const oldPrivateCarJson=require('../json/privateCar.js').privateCar
const newprivatecarJson=require('../json/newPrivateCar.js').newPrivateCar
const taxiJson=require('../json/taxi.js').taxi
const busJson=require('../json/bus').bus
const schoolBusJson=require('../json/schoolBus.js').schoolBus
const threeWheelJson=require('../json/threeWheeler.js').threeWheeler
const goodThreeWheelJson=require('../json/goodsCarringThreeWheeler').goodsCarringThreeWheeler
const goodMoreThreeWheelJson=require('../json/goodsCarringMoreThanThreeWheeler').goodsCarringMoreThanThreeWheeler
const miscellaneousJson=require('../json/miscellaneous.js').miscellaneous
const indianStates=require('../json/indiaStates').states
var jsonDataMessage={
    error:false,
    message:"Data Received"
}

//authentication
apiRoutes.post('/register', userController.createUser)
apiRoutes.post("/getOtp", userController.getOtp);

apiRoutes.get('/indianStates', function(req,res){
    res.status(200).send({error:false,data:indianStates})
})
apiRoutes.post('/verifyOtp', userController.verifyOtp)
apiRoutes.post('/login', userController.login)
apiRoutes.post('/web/login', userController.weblogin)

apiRoutes.post('/changePassword',verifiedUser, userController.changePassword)
apiRoutes.post('/forgotPassword', userController.forgotPassword)



apiRoutes.get('/getContactUs', adminControler.getContactUs)
apiRoutes.post('/postContactUs', adminControler.postContactUs)
apiRoutes.post('/postTP', adminControler.postTP)
apiRoutes.get('/getTP', adminControler.getTP)

// apiRoutes.get('/dynamicJsonValue', adminControler.dynamicJsonValue)

apiRoutes.post('/calculateQuote', calcController.calculateQuote)
apiRoutes.post('/calculateQuoteValues', calcController.calculateQuoteValues) // new api returns values only
apiRoutes.post('/downloadQuote', calcController.downloadQuote)
apiRoutes.post('/calculatePremiumAmount', calcController.calculatePremiumAmount)
apiRoutes.get("/getQuoteQueryRecords", calcController.getQuoteQueryRecords);// added by gokul..
// apiRoutes.get("/getMotorQueryRecords", calcController.getQuoteQueryRecords);// added by gokul..

apiRoutes.get('/categories',function (req,res) {
    res.status(200).send({
        error:false,
        data:categries.categories,
        message:"Data Retrieved"
    })    
})

apiRoutes.get('/categories/form/:id',function (req,res) {
    if(req.params.id==1){
        jsonDataMessage.data=oldTwoWheelJson
        res.status(200).send(jsonDataMessage)    
    }else if(req.params.id==2){
        jsonDataMessage.data=newTwoWheelJson
        res.status(200).send(jsonDataMessage)  
    }else if(req.params.id==3){
        jsonDataMessage.data=oldPrivateCarJson
        res.status(200).send(jsonDataMessage)  
    }else if(req.params.id==4){
        jsonDataMessage.data=newprivatecarJson
        res.status(200).send(jsonDataMessage)     
    }else if(req.params.id==5){
        jsonDataMessage.data=taxiJson
        res.status(200).send(jsonDataMessage)    
    }else if(req.params.id==6){
        jsonDataMessage.data=busJson
        res.status(200).send(jsonDataMessage)    
    }else if(req.params.id==7){
        jsonDataMessage.data=schoolBusJson
        res.status(200).send(jsonDataMessage)    
    }else if(req.params.id==8){
        jsonDataMessage.data=threeWheelJson
        res.status(200).send(jsonDataMessage)      
    }else if(req.params.id==9){
        jsonDataMessage.data=goodThreeWheelJson
        res.status(200).send(jsonDataMessage)     
    }else if(req.params.id==10){
        jsonDataMessage.data=goodMoreThreeWheelJson
        res.status(200).send(jsonDataMessage)     
    }else if(req.params.id==11){
        jsonDataMessage.data=miscellaneousJson
        res.status(200).send(jsonDataMessage)    
    }
    else{
        res.status(200).send({
            error:false,
            data:null,
            message:"Invalid ID"
        })    
    }
})



module.exports = apiRoutes;