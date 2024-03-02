const moment = require('moment');
const privateCar=require('../../configuration/configJson/privateCar').data
const bike=require('../../configuration/configJson/twoWheeler').data
const taxi=require('../../configuration/configJson/taxi').data
const bus=require('../../configuration/configJson/bus').data
const gcvG3=require('../../configuration/configJson/goodsCarryingVehicles').data
const threeWheeler=require('../../configuration/configJson/threeWheeler').data
const miscellaneousVehicle=require('../../configuration/configJson/miscellaneousVehicle').data
const QuoteQueryRecords=require('../../Model/QuoteQueryRecords')
const TPConfig=require('../../Model/TPConfig')

const prepareQuoteValue=async(receivedData,userId)=>{
    const currentYear=new moment().year()
    const cc=Number(receivedData.cC)
    if(receivedData.formId){
        if(receivedData.policyType && ((receivedData.policyType=="Full" && receivedData.zone) || receivedData.policyType!="Full" )){
            const TPValues=await TPConfig.findOne()
            console.log("TPValues",TPValues)
            if(receivedData.formId=="1"){
                receivedData.vehicle="Two Wheeler"
                await saveQuoteQueryRecords(receivedData,userId)
                receivedData.year=1
                let ageofvehicle=currentYear-receivedData.yearOfManufacture
                let baseRateQuery=(cc <= 75 && cc >= 0)  ? "<75" : (cc <= 150 && cc >= 75) ? ">75" : (cc <= 350 && cc > 150) ? "<350" : ">350" 
                let zoneData= ageofvehicle<=5 ? bike.lessThenFiveYears : (ageofvehicle<=10 && ageofvehicle>5) ? bike.lessThenTenYears : bike.greaterThenTenYears
                var tp=TPValues.twoWheeler.oneYearTp
                var tpvalue=(cc <= 75 && cc >= 0)  ? tp.lessthan75 : (cc <= 150 && cc >= 75) ? tp.lessthan150 : (cc <= 350 && cc > 150) ? tp.lessthan350 : tp.greaterthan350
                var tp={
                    TP:tpvalue
                } 
                var data=await calcCarAndBike(receivedData,zoneData,bike,baseRateQuery,tp)
                data.ejs='index'
                return {
                    error:false ,
                    data:data,
                    message:"Data Retrieved Successfully"
                }
            }else if(receivedData.formId=="2"){
                let ageofvehicle=0
                receivedData.vehicle="New Two Wheeler"
                await saveQuoteQueryRecords(receivedData,userId)
                let baseRateQuery=(cc <= 75 && cc >= 0)  ? "<75" : (cc <= 150 && cc >= 75) ? ">75" : (cc <= 350 && cc > 150) ? "<350" : ">350" 
                let zoneData= ageofvehicle<=5 ? bike.lessThenFiveYears : (ageofvehicle<=10 && ageofvehicle>5) ? bike.lessThenTenYears : bike.greaterThenTenYears
                var tp=TPValues.twoWheeler.fiveYearTp
                var tpvalue=(cc <= 75 && cc >= 0)  ? tp.lessthan75 : (cc <= 150 && cc >= 75) ? tp.lessthan150 : (cc <= 350 && cc > 150) ? tp.lessthan350 : tp.greaterthan350
                var tp={
                    TP:tpvalue
                } 
                var data=await calcCarAndBike(receivedData,zoneData,bike,baseRateQuery,tp)
                data.ejs='index'
                return {
                    error:false ,
                    data:data,
                    message:"Data Retrieved Successfully"
                }
            }else if(receivedData.formId=="3"){
                receivedData.vehicle="Private Car"
                await saveQuoteQueryRecords(receivedData,userId)
                receivedData.year=1
                const ageofvehicle=currentYear-receivedData.yearOfManufacture
                let baseRateQuery=cc <= 1000 ? "=1000" : (cc <= 1500 && cc > 1000) ? "<1500" : ">1500" 
                let zoneData= ageofvehicle<=5 ? privateCar.lessThenFiveYears : (ageofvehicle<=10 && ageofvehicle>5) ? privateCar.lessThenTenYears : privateCar.greaterThenTenYears
                var tp=TPValues.privateCar.oneYearTp
                var tpvalue=(cc <= 1000 && cc >= 0)  ? tp.lessthan1000 : (cc <= 1500 && cc >= 1000) ? tp.lessthan1500 : tp.greaterthan1500
                var tp={
                    TP:tpvalue
                } 
                var data=await calcCarAndBike(receivedData,zoneData,privateCar,baseRateQuery,tp)
                data.ejs='index'
                return {
                    error:false ,
                    data:data,
                    message:"Data Retrieved Successfully"
                }
            }else if(receivedData.formId=="4"){
                receivedData.vehicle="New Private Car"
                await saveQuoteQueryRecords(receivedData,userId)
                const ageofvehicle=0
                let zoneData= ageofvehicle<=5 ? privateCar.lessThenFiveYears : (ageofvehicle<=10 && ageofvehicle>5) ? privateCar.lessThenTenYears : privateCar.greaterThenTenYears
                let baseRateQuery=cc <= 1000 ? "=1000" : (cc <= 1500 && cc > 1000) ? "<1500" : ">1500" 
                var tp=TPValues.privateCar.threeYearTp
                var tpvalue=(cc <= 1000 && cc >= 0)  ? tp.lessthan1000 : (cc <= 1500 && cc >= 1000) ? tp.lessthan1500 : tp.greaterthan1500
                var tp={
                    TP:tpvalue
                } 
                var data=await calcCarAndBike(receivedData,zoneData,privateCar,baseRateQuery,tp)
                data.ejs='index'
                return {
                    error:false ,
                    data:data,
                    message:"Data Retrieved Successfully"
                }
            }else if(receivedData.formId=="5"){
                receivedData.vehicle="Taxi"
                await saveQuoteQueryRecords(receivedData,userId)
                let ageofvehicle=currentYear-receivedData.yearOfManufacture
                let baseRateQuery=cc <= 1000 ? "=1000" : (cc <= 1500 && cc > 1000) ? "<1500" : ">1500" 
                let zoneData= ageofvehicle<=5 ? taxi.lessThenFiveYears : (ageofvehicle<=7 && ageofvehicle>5) ? taxi.lessThenSevenYears : taxi.greaterThenSevenYears
                var tp=TPValues.taxi
                var tpvalue=(cc <= 1000 && cc >= 0)  ? tp.lessthan1000 : (cc <= 1500 && cc >= 1000) ? tp.lessthan1500 : tp.greaterthan1500
                var tp=tpvalue
                var data=await calcCarAndBike(receivedData,zoneData,taxi,baseRateQuery,tp)
                data.ejs='index'
                return {
                    error:false ,
                    data:data,
                    message:"Data Retrieved Successfully"
                }
            }else if(receivedData.formId=="6"){
                receivedData.vehicle="Bus"
                await saveQuoteQueryRecords(receivedData,userId)
                let ageofvehicle=currentYear-receivedData.yearOfManufacture
                let baseRateQuery=cc <= 1000 ? "=1000" : (cc <= 1500 && cc > 1000) ? "<1500" : ">1500" 
                let zoneData= ageofvehicle<=5 ? bus.lessThenFiveYears : (ageofvehicle<=7 && ageofvehicle>5) ? bus.lessThenSevenYears : bus.greaterThenSevenYears
                var tp=TPValues.bus
                var data=await calcBus(receivedData,zoneData,bus,baseRateQuery,tp)
                data.ejs='vehicle'
                return {
                    error:false ,
                    data:data,
                    message:"Data Retrieved Successfully"
                }
            }else if(receivedData.formId=="7"){
                receivedData.vehicle="School Bus"
                await saveQuoteQueryRecords(receivedData,userId)
                let ageofvehicle=currentYear-receivedData.yearOfManufacture
                let baseRateQuery=cc <= 1000 ? "=1000" : (cc <= 1500 && cc > 1000) ? "<1500" : ">1500" 
                let zoneData= ageofvehicle<=5 ? bus.lessThenFiveYears : (ageofvehicle<=7 && ageofvehicle>5) ? bus.lessThenSevenYears : bus.greaterThenSevenYears
                var tp=TPValues.schoolBus
                var data=await calcBus(receivedData,zoneData,bus,baseRateQuery,tp)
                data.ejs='vehicle'
                return {
                    error:false ,
                    data:data,
                    message:"Data Retrieved Successfully"
                }
            }else if(receivedData.formId=="8"){
                receivedData.vehicle="Three Wheeler PCV"
                await saveQuoteQueryRecords(receivedData,userId)
                let ageofvehicle=currentYear-receivedData.yearOfManufacture
                let zoneData= ageofvehicle<=5 ? threeWheeler.pcv.lessThenFiveYears : (ageofvehicle<=7 && ageofvehicle>5) ? threeWheeler.pcv.lessThenSevenYears : threeWheeler.pcv.greaterThenSevenYears
                var tp=TPValues.threeWheelerPCV
                var data=await calcThreeWheeler(receivedData,zoneData,threeWheeler.pcv,tp)
                data.ejs='threeWheeler'
                return {
                    error:false ,
                    data:data,
                    message:"Data Retrieved Successfully"
                }
            }else if(receivedData.formId=="9"){
                receivedData.vehicle="Goods Carrying Vehicle(3 Wheeler)"
                await saveQuoteQueryRecords(receivedData,userId)
                let ageofvehicle=currentYear-receivedData.yearOfManufacture
                let zoneData= ageofvehicle<=5 ? threeWheeler.gcv.lessThenFiveYears : (ageofvehicle<=7 && ageofvehicle>5) ? threeWheeler.gcv.lessThenSevenYears : threeWheeler.gcv.greaterThenSevenYears
                var tp=TPValues.threeWheelerGCV
                var data=await calcThreeWheeler(receivedData,zoneData,threeWheeler.gcv,tp)
                data.ejs='threeWheeler'
                return {
                    error:false ,
                    data:data,
                    message:"Data Retrieved Successfully"
                }
            }else if(receivedData.formId=="10"){
                receivedData.vehicle="Goods Carrying Vehicle(More Than 3 Wheeler)"
                await saveQuoteQueryRecords(receivedData,userId)
                let ageofvehicle=currentYear-receivedData.yearOfManufacture
                let baseRateQuery=cc <= 1000 ? "=1000" : (cc <= 1500 && cc > 1000) ? "<1500" : ">1500" 
                let zoneData= ageofvehicle<=5 ? gcvG3.lessThenFiveYears : (ageofvehicle<=7 && ageofvehicle>5) ? gcvG3.lessThenSevenYears : gcvG3.greaterThenSevenYears
                var tp=TPValues.morethanThreeWheelGCV
                var data=await calcBus(receivedData,zoneData,gcvG3,baseRateQuery,tp)
                data.ejs='vehicle'
                return {
                    error:false ,
                    data:data,
                    message:"Data Retrieved Successfully"
                }
            }else if(receivedData.formId=="11"){
                receivedData.vehicle="Mischelleneous"
                await saveQuoteQueryRecords(receivedData,userId)
                let ageofvehicle=currentYear-receivedData.yearOfManufacture
                let baseRateQuery=cc <= 1000 ? "=1000" : (cc <= 1500 && cc > 1000) ? "<1500" : ">1500" 
                let zoneData= ageofvehicle<=5 ? miscellaneousVehicle.lessThenFiveYears : (ageofvehicle<=7 && ageofvehicle>5) ? miscellaneousVehicle.lessThenSevenYears : miscellaneousVehicle.greaterThenSevenYears
                var data=await calcmisc(receivedData,zoneData,miscellaneousVehicle,baseRateQuery)
                data.ejs='vehicle'
                return {
                    error:false ,
                    data:data,
                    message:"Data Retrieved Successfully"
                }
            }else {
                return {
                    error:true ,
                    message:"Invalid Form ID"
                }
            }
        }else{
            return {
                error:true ,
                message:"Please fill all Fields"
            }
        }
    }else{
        return {
            error:true ,
            message:"Invalid Form ID"
        }
    }
}

const saveQuoteQueryRecords=async(receivedData,userId)=>{
    let sendData = {
      formId: receivedData.formId,
      userId: receivedData.userId,
      vehicle: receivedData.vehicle,
      quoteId: receivedData?.quoteId,
      isWebUser:receivedData?.isWebUser
    };
    let data=new QuoteQueryRecords(sendData)
    data.save()
}

const calcCarAndBike =async(receivedData,zoneData,vehicleData,baseRateQuery,tp)=>{
    var sendData={}
    let currentYear=new moment().year()
    const ageofvehicle=currentYear-receivedData.yearOfManufacture
    const cc=Number(receivedData.cC)
    if(receivedData.policyType=="Full" && receivedData.zone){
        sendData.iDV=receivedData.iDV // ? receivedData.iDV<=100 ? receivedData.iDV : 100 : 0
        sendData.premiumName=vehicleData.premiumName
        sendData.vehicleNumber=receivedData.vehicleNumber
        sendData.customerName=receivedData.customerName
        sendData.makeModel=receivedData.makeModel
        sendData.yearOfManufacture=receivedData.yearOfManufacture
        sendData.cc=cc
        sendData.zone=receivedData.zone
        sendData.vehiclebaseRate=zoneData[receivedData.zone][ 'cc'+baseRateQuery ].value
        sendData.vehiclebaseRateValue=receivedData.iDV ? (sendData.vehiclebaseRate*receivedData.iDV/100).toFixed(2) : 0
        sendData.discountonODPremium=receivedData['discountonODPremium(%)'] ? receivedData['discountonODPremium(%)']<=100 ? receivedData['discountonODPremium(%)'] : 100 : 0
        sendData.discountonODPremiumValue=(sendData.vehiclebaseRateValue*sendData.discountonODPremium/100).toFixed(2)
        sendData.basicODPremiumAfterDiscount=Math.round(sendData.vehiclebaseRateValue-sendData.discountonODPremiumValue)
        sendData.accessories=receivedData.accessoriesValue ? receivedData.accessoriesValue : 0
        sendData.accessoriesValue= ((sendData.accessories*vehicleData.accessoriespercent)/100).toFixed(2)
        sendData.totalBasicPremium=Number(sendData.basicODPremiumAfterDiscount)+Number(sendData.accessoriesValue)
        sendData.noClaimBonus=0
        sendData.noClaimBonusValue=0
        if(receivedData.formId!="2"){
            sendData.noClaimBonus=receivedData['noClaimBonus(%)'] ? receivedData['noClaimBonus(%)'] : 0
            sendData.noClaimBonusValue=Math.round(sendData.totalBasicPremium*sendData.noClaimBonus/100)
        }
        sendData.netOwnDamage=sendData.totalBasicPremium-sendData.noClaimBonusValue
        sendData.zeroDepPremium=receivedData.zeroDepreciation ? receivedData.zeroDepreciation : 0
        sendData.zeroDepPremiumValue=Math.round(sendData.iDV*sendData.zeroDepPremium/100)
        sendData.lPGKit_B=0
        sendData.lPGKit_A=0
        if(receivedData.lPGKit=='1') {
            sendData.lPGKit_B=60
            if(receivedData.lPGKitTYPE=='1'){
                sendData.lPGKit_A=sendData.vehiclebaseRateValue*5/100
            }else{
                let onadditionvalue=receivedData.lPGOnAddition
                sendData.lPGKit_A=onadditionvalue*5/100
            }
        }  
        sendData.totalAodPremium=sendData.netOwnDamage+sendData.zeroDepPremiumValue+sendData.lPGKit_A
        sendData.year=receivedData.year ? Number(receivedData?.year ): 1
        sendData.LP = tp.TP
        // sendData.LP = receivedData.formId=="1" ? zoneData[receivedData.zone]['cc'+baseRateQuery  ].oneYearTp :  receivedData.formId=="2" ? zoneData[receivedData.zone]['cc'+baseRateQuery  ].fiveYearTp :  receivedData.formId=="3" ? zoneData[receivedData.zone]['cc'+baseRateQuery  ].oneYearTp :  receivedData.formId=="4" ? zoneData[receivedData.zone]['cc'+baseRateQuery  ].threeYearTp : 0
        // if(zoneData[receivedData.zone]['cc'+baseRateQuery  ].tpPerm){
        //     sendData.LP=zoneData[receivedData.zone]['cc'+baseRateQuery  ].tpPerm
        // }
        sendData.pAOwnerDriver=receivedData.pAOwnerDriver ? receivedData.pAOwnerDriver*sendData.year : 0
        sendData.pAUnnamedPassenger=receivedData.pAUnnamedPassenger ? Math.round((receivedData.pAUnnamedPassenger*vehicleData.PAunnamedPercent/100)*(receivedData.seatingCapacity ? receivedData.seatingCapacity : 1)) : 0
        sendData.lLtoPaidDriver =receivedData.lLtoPaidDriver ? Number(receivedData.lLtoPaidDriver) : 0
        sendData.tppd=receivedData.tPPDRestrict == 'yes' ? vehicleData?.tppd : 0
        sendData.totalBodPremium = sendData.LP + sendData.pAOwnerDriver + sendData.pAUnnamedPassenger + sendData.lLtoPaidDriver + sendData.tppd +sendData.lPGKit_B
        if(receivedData.formId=="5"){
            sendData.llToPassengers=Math.round(tp.perPassenger * receivedData.seatingCapacity)
            sendData.totalBodPremium = sendData.totalBodPremium + sendData.llToPassengers

        }
        sendData.netPremiumAB= sendData.totalAodPremium +sendData.totalBodPremium
        sendData.tax=sendData.netPremiumAB*18/100
        sendData.finalPremium=Math.round(sendData.netPremiumAB+sendData.tax)
        sendData.formId=receivedData.formId
        sendData.company=receivedData?.company
        if(receivedData.formId!="1" && receivedData.formId!="2"){
            sendData.showlLtoPaidDriver=true
        }    
    }
    else{
        sendData.vehicleNumber=receivedData.vehicleNumber
        sendData.customerName=receivedData.customerName
        sendData.makeModel=receivedData.makeModel
        sendData.company=receivedData?.company
        sendData.premiumName=vehicleData.premiumName
        sendData.cc=receivedData.cC ? receivedData.cC : 0
        sendData.year=receivedData.year ? Number(receivedData?.year ): 1
        sendData.LP = tp.TP
        // sendData.LP = receivedData.formId=="1" ? zoneData["A"]['cc'+baseRateQuery].oneYearTp :  receivedData.formId=="2" ? zoneData["A"]['cc'+baseRateQuery  ].fiveYearTp :  receivedData.formId=="3" ? zoneData["A"]['cc'+baseRateQuery  ].oneYearTp :  receivedData.formId=="4" ? zoneData["A"]['cc'+baseRateQuery  ].threeYearTp : 0
        // let quer='cc'+baseRateQuery
        // if(zoneData?.A[quer]?.tpPerm){
        //     sendData.LP=zoneData?.A[quer]?.tpPerm
        // }
        sendData.pAOwnerDriver=receivedData.pAOwnerDriver ? Number(receivedData.pAOwnerDriver)*sendData.year : 0
        sendData.pAUnnamedPassenger=receivedData.pAUnnamedPassenger ? Math.round((receivedData.pAUnnamedPassenger*vehicleData.PAunnamedPercent/100)*(receivedData.seatingCapacity ? receivedData.seatingCapacity : 1)) : 0
        sendData.lLtoPaidDriver =receivedData.lLtoPaidDriver ? Number(receivedData.lLtoPaidDriver) : 0
        sendData.tppd=0
        if(receivedData.tPPDRestrict == 'yes'){
            sendData.tppd=vehicleData.tppd ? (vehicleData.tppd*sendData.year) : 0
        }
        sendData.totalBodPremium = sendData.LP + sendData.pAOwnerDriver + sendData.pAUnnamedPassenger + sendData.lLtoPaidDriver + sendData.tppd
        if(receivedData.formId=="5"){
            sendData.llToPassengers=Math.round(tp?.perPassenger * receivedData.seatingCapacity)
            sendData.totalBodPremium = sendData.totalBodPremium + sendData.llToPassengers
        }
        sendData.totalAodPremium =0
        sendData.netPremiumAB= sendData.totalAodPremium +sendData.totalBodPremium
        sendData.tax=sendData.netPremiumAB*18/100
        sendData.finalPremium=Math.round(sendData.netPremiumAB+sendData.tax)
        sendData.formId=receivedData.formId
        if(receivedData.formId!="1" && receivedData.formId!="2"){
            sendData.showlLtoPaidDriver=true
        }
    }
    return sendData
}

const calcBus =async(receivedData,zoneData,vehicleData,baseRateQuery,tp)=>{
    var sendData={}
    let currentYear=new moment().year()
    const ageofvehicle=currentYear-receivedData.yearOfManufacture
    if(receivedData.policyType=="Full"){
        sendData.iDV=receivedData.iDV
        sendData.premiumName=vehicleData.premiumName
        sendData.vehicleNumber=receivedData?.vehicleNumber
        sendData.customerName=receivedData?.customerName
        sendData.company=receivedData?.company
        sendData.makeModel=receivedData?.makeModel
        sendData.yearOfManufacture=receivedData.yearOfManufacture
        sendData.zone=receivedData.zone
        sendData.vehiclebaseRate=zoneData[receivedData.zone]
        sendData.vehiclebaseRateValue=receivedData.iDV ? (sendData.vehiclebaseRate*receivedData.iDV/100).toFixed(2) : 0
        sendData.imt23=receivedData?.iMT23==1 ? vehicleData.iMT23 : 0
        sendData.LP = receivedData.formId!="10" ? tp.TP : 0
        sendData.gVW=0
        sendData.additionalGVW=0
        if(receivedData.formId=="10"){
            let gVW=receivedData.gVW
            let quer=gVW<=7500 ? "upto7500" : (gVW>7500 && gVW<=12000) ? "upto12000" :  (gVW>12000 && gVW<=20000) ? "upto20000" :  (gVW>20000 && gVW<=40000) ?  "upto40000" : "above40000"
            sendData.LP = tp[quer]
            sendData.additionalGVW = gVW>12000 ? ((gVW-12000)/100*27) : 0
            sendData.gVW=gVW
        }
        sendData.imt23Value=((Number(sendData.vehiclebaseRateValue)+Number(sendData.additionalGVW))*sendData.imt23/100).toFixed(2)
        sendData.OdPremium=(Number(sendData.vehiclebaseRateValue)+Number(sendData.additionalGVW) + Number(sendData.imt23Value)).toFixed(2)
        sendData.seatingCapacityvalue=0
        sendData.seatingCapacityAmount=0
        if(receivedData?.formId!="10" && receivedData?.formId!="11"){
            sendData.seatingCapacity=receivedData.seatingCapacity ? Number(receivedData.seatingCapacity) : 7
            let query=sendData.seatingCapacity<=18 ? "<=18" : sendData.seatingCapacity<=36 ? "<=36" : sendData.seatingCapacity<=60 ? "<=60" : ">60"
            sendData.seatingCapacityvalue=vehicleData.seatingCapacity[query]
            sendData.seatingCapacityAmount=sendData.seatingCapacityvalue
            sendData.seatingCapacityvalue=Math.round(Number(sendData.seatingCapacityvalue) + Number(sendData.vehiclebaseRateValue))
            sendData.imt23=receivedData.iMT23==1 ? vehicleData.iMT23 : 0
            sendData.imt23Value=sendData.seatingCapacityvalue*sendData.imt23/100
            sendData.OdPremium=(Number(sendData.seatingCapacityvalue) + Number(sendData.imt23Value)).toFixed(2)
        }
        sendData.discountonODPremium=receivedData['discountonODPremium(%)'] ? receivedData['discountonODPremium(%)']<=100 ? receivedData['discountonODPremium(%)'] : 100 : 0
        sendData.discountonODPremiumValue=(sendData.OdPremium*sendData.discountonODPremium/100).toFixed(2)
        sendData.basicODPremiumAfterDiscount=Math.round(sendData.OdPremium-sendData.discountonODPremiumValue)
        sendData.accessories=receivedData.accessoriesValue ? receivedData.accessoriesValue : 0
        sendData.accessoriesValue= Math.round(sendData.accessories*vehicleData.accessoriespercent/100)
        sendData.totalBasicPremium=sendData.basicODPremiumAfterDiscount+sendData.accessoriesValue
        sendData.noClaimBonus=receivedData['noClaimBonus(%)'] ? receivedData['noClaimBonus(%)'] : 0
        sendData.noClaimBonusValue=Math.round(sendData.totalBasicPremium*sendData.noClaimBonus/100)
        sendData.netOwnDamage=sendData.totalBasicPremium-sendData.noClaimBonusValue
        sendData.zeroDepPremium=receivedData.zeroDepreciation ? receivedData.zeroDepreciation : 0
        sendData.zeroDepPremiumValue=Math.round(sendData.iDV*sendData.zeroDepPremium/100)
        sendData.lPGKit_B=0
        sendData.lPGKit_A=0
        if(receivedData.lPGKit=='1') {
            sendData.lPGKit_B=60
            if(receivedData.lPGKitTYPE=='1'){
                sendData.lPGKit_A=sendData.vehiclebaseRateValue*5/100
            }else{
                let onadditionvalue=receivedData.lPGOnAddition
                sendData.lPGKit_A=(onadditionvalue*5/100)
            }
        } 
        sendData.totalAodPremium=sendData.netOwnDamage+sendData.zeroDepPremiumValue+sendData.lPGKit_A
        sendData.year=receivedData.year ? Number(receivedData?.year ): 1
        sendData.pAOwnerDriver=receivedData.pAOwnerDriver ? receivedData.pAOwnerDriver*sendData.year : 0
        sendData.lLtoPaidDriver =receivedData.lLtoPaidDriver ? Number(receivedData.lLtoPaidDriver) : 0
        var perPassenger=receivedData.formId=="6" ? tp.perPassenger : receivedData.formId=="7" ? tp.perPassenger : 0
        sendData.llToPassengers=Math.round( perPassenger * receivedData.seatingCapacity)
        sendData.CooliesAndCleaner = receivedData['coolies/Cleaner'] ? receivedData['coolies/Cleaner'] : 0
        sendData.totalBodPremium = Number(sendData.LP) + Number(sendData.pAOwnerDriver) + Number(sendData.lLtoPaidDriver)  + Number(sendData.CooliesAndCleaner)+sendData.lPGKit_B
        sendData.totalBodPremium = Number(sendData.totalBodPremium) + Number(sendData.llToPassengers)
        sendData.netPremiumAB= sendData.totalAodPremium +sendData.totalBodPremium
        sendData.tax=sendData.netPremiumAB*18/100
        sendData.finalPremium=Math.round(sendData.netPremiumAB+sendData.tax)
        sendData.tax12=sendData.LP*12/100
        sendData.tax18=(sendData.netPremiumAB-sendData.LP)*18/100
        sendData.formId=receivedData.formId
        if(receivedData.formId=="10"){
            sendData.finalPremium=Math.round(sendData.netPremiumAB+sendData.tax12+sendData.tax18)
        }
    }
    else{
        sendData.vehicleNumber=receivedData.vehicleNumber
        sendData.customerName=receivedData.customerName
        sendData.company=receivedData?.company
        sendData.makeModel=receivedData.makeModel
        sendData.premiumName=vehicleData.premiumName
        sendData.vehiclebaseRateValue=0
        sendData.seatingCapacityvalue=0
        sendData.seatingCapacityAmount=0
        sendData.year=receivedData.year ? Number(receivedData?.year ): 1
        sendData.LP = receivedData.formId!="10" ? tp.TP : 0
        if(receivedData.formId=="10"){
            let gVW=receivedData.gVW
            let quer=gVW<=7500 ? "upto7500" : (gVW>7500 && gVW<=12000) ? "upto12000" :  (gVW>12000 && gVW<=20000) ? "upto20000" :  (gVW>20000 && gVW<=40000) ?  "upto40000" : "above40000"
            sendData.LP = tp[quer]
            sendData.additionalGVW = gVW>12000 ? ((gVW-12000)/100*27) : 0
            sendData.gVW=gVW
        }
        if(receivedData.formId!="10" && receivedData?.formId!="11" && receivedData?.formId!="7" && receivedData?.formId!="6")  {
            sendData.seatingCapacity=receivedData.seatingCapacity ? Number(receivedData.seatingCapacity) : 7
            let query=sendData.seatingCapacity<=18 ? "<=18" : sendData.seatingCapacity<=36 ? "<=36" : sendData.seatingCapacity<=60 ? "<=60" : ">60"
            sendData.seatingCapacityvalue=vehicleData.seatingCapacity[query]
            sendData.seatingCapacityAmount=sendData.seatingCapacityvalue
            sendData.seatingCapacityvalue=Math.round(Number(sendData.seatingCapacityvalue) + Number(sendData.vehiclebaseRateValue))
        }
        sendData.pAOwnerDriver=receivedData.pAOwnerDriver ? receivedData.pAOwnerDriver*sendData.year : 0
        sendData.lLtoPaidDriver =receivedData.lLtoPaidDriver ? Number(receivedData.lLtoPaidDriver) : 0
        var perPassenger=receivedData.formId=="6" ? tp.perPassenger : receivedData.formId=="7" ? tp.perPassenger : 0
        sendData.llToPassengers=Math.round( perPassenger * receivedData.seatingCapacity)
        sendData.CooliesAndCleaner = receivedData['coolies/Cleaner'] ? receivedData['coolies/Cleaner'] : 0
        sendData.totalAodPremium=sendData.seatingCapacityvalue
        sendData.totalBodPremium = Number(sendData.LP) + Number(sendData.pAOwnerDriver) + Number(sendData.lLtoPaidDriver)  + Number(sendData.CooliesAndCleaner)
        sendData.totalBodPremium = Number(sendData.totalBodPremium) + Number(sendData.llToPassengers)
        sendData.netPremiumAB= sendData.totalAodPremium +sendData.totalBodPremium
        sendData.tax=sendData.netPremiumAB*18/100
        sendData.finalPremium=Math.round(sendData.netPremiumAB+sendData.tax)
        sendData.tax12=sendData.LP*12/100
        sendData.tax18=(sendData.netPremiumAB-sendData.LP)*18/100
        sendData.formId=receivedData.formId
        if(receivedData.formId=="10"){
            sendData.finalPremium=Math.round(sendData.netPremiumAB+sendData.tax12+sendData.tax18)
        }
    }
    return sendData
}

const calcThreeWheeler =async(receivedData,zoneData,vehicleData,tp)=>{
    var sendData={}
    let currentYear=new moment().year()
    const ageofvehicle=currentYear-receivedData.yearOfManufacture
    if(receivedData.policyType=="Full" && receivedData.zone){
        sendData.iDV=receivedData.iDV
        sendData.premiumName=vehicleData.premiumName
        sendData.vehicleNumber=receivedData?.vehicleNumber
        sendData.customerName=receivedData?.customerName
        sendData.company=receivedData?.company
        sendData.makeModel=receivedData?.makeModel
        sendData.yearOfManufacture=receivedData.yearOfManufacture
        sendData.zone=receivedData.zone
        sendData.vehiclebaseRate=zoneData[receivedData.zone]
        sendData.vehiclebaseRateValue=receivedData.iDV ? (sendData.vehiclebaseRate*receivedData.iDV/100).toFixed(2) : 0
        sendData.imt23=receivedData?.iMT23==1 ? vehicleData.iMT23 : 0
        sendData.imt23Value=(sendData.vehiclebaseRateValue*sendData.imt23/100).toFixed(2)
        sendData.OdPremium=(Number(sendData.vehiclebaseRateValue) + Number(sendData.imt23Value)).toFixed(2)
        sendData.seatingCapacityvalue=0
        sendData.seatingCapacityAmount=0
        sendData.discountonODPremium=receivedData['discountonODPremium(%)'] ? receivedData['discountonODPremium(%)']<=100 ? receivedData['discountonODPremium(%)'] : 100 : 0
        sendData.discountonODPremiumValue=(sendData.OdPremium*sendData.discountonODPremium/100).toFixed(2)
        sendData.basicODPremiumAfterDiscount=Math.round(sendData.OdPremium-sendData.discountonODPremiumValue)
        sendData.accessories=receivedData.accessoriesValue ? receivedData.accessoriesValue : 0
        sendData.accessoriesValue= Math.round(sendData.accessories*vehicleData.accessoriespercent/100)
        sendData.totalBasicPremium=sendData.basicODPremiumAfterDiscount+sendData.accessoriesValue
        sendData.noClaimBonus=receivedData['noClaimBonus(%)'] ? receivedData['noClaimBonus(%)'] : 0
        sendData.noClaimBonusValue=Math.round(sendData.totalBasicPremium*sendData.noClaimBonus/100)
        sendData.netOwnDamage=sendData.totalBasicPremium-sendData.noClaimBonusValue
        sendData.zeroDepPremium=0
        sendData.zeroDepPremiumValue=0
        if(receivedData.formId!="8"){
            sendData.zeroDepPremium=receivedData.zeroDepreciation ? receivedData.zeroDepreciation : 0
            sendData.zeroDepPremiumValue=Math.round(sendData.iDV*sendData.zeroDepPremium/100)
        }
        sendData.lPGKit_B=0
        sendData.lPGKit_A=0
        if(receivedData.lPGKit=='1') {
            sendData.lPGKit_B=60
            if(receivedData.lPGKitTYPE=='1'){
                sendData.lPGKit_A=sendData.vehiclebaseRateValue*5/100
            }else{
                let onadditionvalue=receivedData.lPGOnAddition
                sendData.lPGKit_A=(onadditionvalue*5/100)
            }
        } 
        sendData.totalAodPremium=sendData.netOwnDamage+sendData.zeroDepPremiumValue+sendData.lPGKit_A
        sendData.year=receivedData.year ? Number(receivedData?.year ): 1
        sendData.LP = tp.TP
        sendData.pAOwnerDriver=receivedData.pAOwnerDriver ? receivedData.pAOwnerDriver*sendData.year : 0
        sendData.lLtoPaidDriver =receivedData.lLtoPaidDriver ? Number(receivedData.lLtoPaidDriver) : 0
        var perPassenger=receivedData.formId=="8" ? tp.perPassenger  : 0
        sendData.llToPassengers=Math.round( perPassenger * receivedData.seatingCapacity)
        sendData.CooliesAndCleaner = receivedData['coolies/Cleaner'] ? receivedData['coolies/Cleaner'] : 0
        sendData.tppd=receivedData.tPPDRestrict == 'yes' ? vehicleData?.tppd : 0
        sendData.totalBodPremium = Number(sendData.LP) + Number(sendData.pAOwnerDriver) + Number(sendData.lLtoPaidDriver)  + Number(sendData.CooliesAndCleaner) +Number(sendData.tppd)
        sendData.totalBodPremium = Number(sendData.totalBodPremium) + Number(sendData.llToPassengers) + sendData.lPGKit_B
        sendData.netPremiumAB= sendData.totalAodPremium +sendData.totalBodPremium
        sendData.tax=sendData.netPremiumAB*18/100
        sendData.finalPremium=Math.round(sendData.netPremiumAB+sendData.tax)
        sendData.tax12=(Number(sendData.LP)+Number(sendData.tppd))*12/100
        sendData.tax18=(sendData.netPremiumAB-sendData.LP-Number(sendData.tppd))*18/100
        sendData.formId=receivedData.formId
        if(receivedData.formId=="9"){
            sendData.finalPremium=Math.round(sendData.netPremiumAB+sendData.tax12+sendData.tax18)
        }
    }
    else{
        sendData.vehiclebaseRateValue=0
        sendData.seatingCapacityvalue=0
        sendData.seatingCapacityAmount=0
        sendData.vehicleNumber=receivedData.vehicleNumber
        sendData.customerName=receivedData.customerName
        sendData.company=receivedData?.company
        sendData.makeModel=receivedData.makeModel
        sendData.premiumName=vehicleData.premiumName
        sendData.year=receivedData.year ? Number(receivedData?.year ): 1
        sendData.LP = tp.TP
        sendData.pAOwnerDriver=receivedData.pAOwnerDriver ? receivedData.pAOwnerDriver*sendData.year : 0
        sendData.lLtoPaidDriver =receivedData.lLtoPaidDriver ? Number(receivedData.lLtoPaidDriver) : 0
        var perPassenger=receivedData.formId=="8" ? tp.perPassenger :  0
        sendData.llToPassengers=Math.round( perPassenger * receivedData.seatingCapacity)
        sendData.CooliesAndCleaner = receivedData['coolies/Cleaner'] ? receivedData['coolies/Cleaner'] : 0
        sendData.totalAodPremium=sendData.seatingCapacityvalue
        sendData.tppd=receivedData.tPPDRestrict == 'yes' ? vehicleData?.tppd : 0
        sendData.totalBodPremium = Number(sendData.LP) + Number(sendData.pAOwnerDriver) + Number(sendData.lLtoPaidDriver)  + Number(sendData.CooliesAndCleaner) +Number(sendData.tppd)
        sendData.totalBodPremium = Number(sendData.totalBodPremium) + Number(sendData.llToPassengers)
        sendData.netPremiumAB= sendData.totalAodPremium +sendData.totalBodPremium
        sendData.tax=sendData.netPremiumAB*18/100
        sendData.finalPremium=Math.round(sendData.netPremiumAB+sendData.tax)
        sendData.tax12=(Number(sendData.LP)+Number(sendData.tppd))*12/100
        sendData.tax18=(sendData.netPremiumAB-sendData.LP-Number(sendData.tppd))*18/100
        sendData.formId=receivedData.formId
        if(receivedData.formId=="9"){
            sendData.finalPremium=Math.round(sendData.netPremiumAB+sendData.tax12+sendData.tax18)
        }
    }
    return sendData
}

const calcmisc =async(receivedData,zoneData,vehicleData,baseRateQuery)=>{
    var sendData={}
    let currentYear=new moment().year()
    const ageofvehicle=currentYear-receivedData.yearOfManufacture
    if(receivedData.policyType=="Full"){
        sendData.iDV=receivedData.iDV
        sendData.premiumName=vehicleData.premiumName
        sendData.vehicleNumber=receivedData?.vehicleNumber
        sendData.customerName=receivedData?.customerName
        sendData.company=receivedData?.company
        sendData.makeModel=receivedData?.makeModel
        sendData.yearOfManufacture=receivedData.yearOfManufacture
        sendData.zone=receivedData.zone
        sendData.vehiclebaseRate=zoneData[receivedData.zone]
        sendData.vehiclebaseRateValue=receivedData.iDV ? (sendData.vehiclebaseRate*receivedData.iDV/100).toFixed(2) : 0
        sendData.imt23=receivedData?.iMT23==1 ? vehicleData.iMT23 : 0
        sendData.LP = receivedData.formId=="6" ? vehicleData.otherBus.TP : receivedData.formId=="7" ? vehicleData.educationalBus.TP : receivedData.formId=="11" ? vehicleData?.TP : 0
        sendData.gVW=0
        sendData.additionalGVW=0
        if(receivedData.formId=="10"){
            let gVW=receivedData.gVW
            let quer=gVW<=7500 ? "<7500" : (gVW>7500 && gVW<=12000) ? "<12000" :  (gVW>12000 && gVW<=20000) ? "<20000" :  (gVW>20000 && gVW<=40000) ?  "<40000" : ">40000"
            sendData.LP = vehicleData.TP[quer]
            sendData.additionalGVW = gVW>12000 ? ((gVW-12000)/100*27) : 0
            sendData.gVW=gVW
        }
        sendData.imt23Value=((Number(sendData.vehiclebaseRateValue)+Number(sendData.additionalGVW))*sendData.imt23/100).toFixed(2)
        sendData.OdPremium=(Number(sendData.vehiclebaseRateValue)+Number(sendData.additionalGVW) + Number(sendData.imt23Value)).toFixed(2)
        sendData.seatingCapacityvalue=0
        sendData.seatingCapacityAmount=0
        if(receivedData?.formId!="10" && receivedData?.formId!="11"){
            sendData.seatingCapacity=receivedData.seatingCapacity ? Number(receivedData.seatingCapacity) : 7
            let query=sendData.seatingCapacity<=18 ? "<=18" : sendData.seatingCapacity<=36 ? "<=36" : sendData.seatingCapacity<=60 ? "<=60" : ">60"
            sendData.seatingCapacityvalue=vehicleData.seatingCapacity[query]
            sendData.seatingCapacityAmount=sendData.seatingCapacityvalue
            sendData.seatingCapacityvalue=Math.round(Number(sendData.seatingCapacityvalue) + Number(sendData.vehiclebaseRateValue))
            sendData.imt23=receivedData.iMT23==1 ? vehicleData.iMT23 : 0
            sendData.imt23Value=sendData.seatingCapacityvalue*sendData.imt23/100
            sendData.OdPremium=(Number(sendData.seatingCapacityvalue) + Number(sendData.imt23Value)).toFixed(2)
        }
        sendData.discountonODPremium=receivedData['discountonODPremium(%)'] ? receivedData['discountonODPremium(%)']<=100 ? receivedData['discountonODPremium(%)'] : 100 : 0
        sendData.discountonODPremiumValue=(sendData.OdPremium*sendData.discountonODPremium/100).toFixed(2)
        sendData.basicODPremiumAfterDiscount=Math.round(sendData.OdPremium-sendData.discountonODPremiumValue)
        sendData.accessories=receivedData.accessoriesValue ? receivedData.accessoriesValue : 0
        sendData.accessoriesValue= Math.round(sendData.accessories*vehicleData.accessoriespercent/100)
        sendData.totalBasicPremium=sendData.basicODPremiumAfterDiscount+sendData.accessoriesValue
        sendData.noClaimBonus=receivedData['noClaimBonus(%)'] ? receivedData['noClaimBonus(%)'] : 0
        sendData.noClaimBonusValue=Math.round(sendData.totalBasicPremium*sendData.noClaimBonus/100)
        sendData.netOwnDamage=sendData.totalBasicPremium-sendData.noClaimBonusValue
        sendData.zeroDepPremium=receivedData.zeroDepreciation ? receivedData.zeroDepreciation : 0
        sendData.zeroDepPremiumValue=Math.round(sendData.iDV*sendData.zeroDepPremium/100)
        sendData.lPGKit_B=0
        sendData.lPGKit_A=0
        if(receivedData.lPGKit=='1') {
            sendData.lPGKit_B=60
            if(receivedData.lPGKitTYPE=='1'){
                sendData.lPGKit_A=sendData.vehiclebaseRateValue*5/100
            }else{
                let onadditionvalue=receivedData.lPGOnAddition
                sendData.lPGKit_A=(onadditionvalue*5/100)
            }
        } 
        sendData.totalAodPremium=sendData.netOwnDamage+sendData.zeroDepPremiumValue+sendData.lPGKit_A
        sendData.year=receivedData.year ? Number(receivedData?.year ): 1
        sendData.pAOwnerDriver=receivedData.pAOwnerDriver ? receivedData.pAOwnerDriver*sendData.year : 0
        sendData.lLtoPaidDriver =receivedData.lLtoPaidDriver ? Number(receivedData.lLtoPaidDriver) : 0
        var perPassenger=receivedData.formId=="6" ? vehicleData.otherBus.perPassenger : receivedData.formId=="7" ? vehicleData.educationalBus.perPassenger : 0
        sendData.llToPassengers=Math.round( perPassenger * receivedData.seatingCapacity)
        sendData.CooliesAndCleaner = receivedData['coolies/Cleaner'] ? receivedData['coolies/Cleaner'] : 0
        sendData.totalBodPremium = Number(sendData.LP) + Number(sendData.pAOwnerDriver) + Number(sendData.lLtoPaidDriver)  + Number(sendData.CooliesAndCleaner)
        sendData.totalBodPremium = Number(sendData.totalBodPremium) + Number(sendData.llToPassengers) +sendData.lPGKit_B
        sendData.netPremiumAB= sendData.totalAodPremium +sendData.totalBodPremium
        sendData.tax=sendData.netPremiumAB*18/100
        sendData.finalPremium=Math.round(sendData.netPremiumAB+sendData.tax)
        sendData.tax12=sendData.LP*12/100
        sendData.tax18=(sendData.netPremiumAB-sendData.LP)*18/100
        sendData.formId=receivedData.formId
        if(receivedData.formId=="10"){
            sendData.finalPremium=Math.round(sendData.netPremiumAB+sendData.tax12+sendData.tax18)
        }
    }
    else{
        sendData.vehicleNumber=receivedData.vehicleNumber
        sendData.customerName=receivedData.customerName
        sendData.company=receivedData?.company
        sendData.makeModel=receivedData.makeModel
        sendData.premiumName=vehicleData.premiumName
        sendData.vehiclebaseRateValue=0
        sendData.seatingCapacityvalue=0
        sendData.seatingCapacityAmount=0
        sendData.year=receivedData.year ? Number(receivedData?.year ): 1
        sendData.LP = receivedData.formId=="6" ? vehicleData.otherBus.TP : receivedData.formId=="7" ? vehicleData.educationalBus.TP : receivedData.formId=="11" ? vehicleData?.TP : 0
        if(receivedData.formId=="10"){
            let gVW=receivedData.gVW
            let quer=gVW<=7500 ? "<7500" : (gVW>7500 && gVW<=12000) ? "<12000" :  (gVW>12000 && gVW<=20000) ? "<20000" :  (gVW>20000 && gVW<=40000) ?  "<40000" : ">40000"
            sendData.additionalGVW = gVW>12000 ? ((gVW-12000)/100*27) : 0
            sendData.LP = vehicleData.TP[quer]
            sendData.gVW=gVW
        }
        if(receivedData.formId!="10" && receivedData?.formId!="11" && receivedData?.formId!="7" && receivedData?.formId!="6")  {
            sendData.seatingCapacity=receivedData.seatingCapacity ? Number(receivedData.seatingCapacity) : 7
            let query=sendData.seatingCapacity<=18 ? "<=18" : sendData.seatingCapacity<=36 ? "<=36" : sendData.seatingCapacity<=60 ? "<=60" : ">60"
            sendData.seatingCapacityvalue=vehicleData.seatingCapacity[query]
            sendData.seatingCapacityAmount=sendData.seatingCapacityvalue
            sendData.seatingCapacityvalue=Math.round(Number(sendData.seatingCapacityvalue) + Number(sendData.vehiclebaseRateValue))
        }
        sendData.pAOwnerDriver=receivedData.pAOwnerDriver ? receivedData.pAOwnerDriver*sendData.year : 0
        sendData.lLtoPaidDriver =receivedData.lLtoPaidDriver ? Number(receivedData.lLtoPaidDriver) : 0
        var perPassenger=receivedData.formId=="6" ? vehicleData.otherBus.perPassenger : receivedData.formId=="7" ? vehicleData.educationalBus.perPassenger : 0
        sendData.llToPassengers=Math.round( perPassenger * receivedData.seatingCapacity)
        sendData.CooliesAndCleaner = receivedData['coolies/Cleaner'] ? receivedData['coolies/Cleaner'] : 0
        sendData.totalAodPremium=sendData.seatingCapacityvalue
        sendData.totalBodPremium = Number(sendData.LP) + Number(sendData.pAOwnerDriver) + Number(sendData.lLtoPaidDriver)  + Number(sendData.CooliesAndCleaner)
        sendData.totalBodPremium = Number(sendData.totalBodPremium) + Number(sendData.llToPassengers)
        sendData.netPremiumAB= sendData.totalAodPremium +sendData.totalBodPremium
        sendData.tax=sendData.netPremiumAB*18/100
        sendData.finalPremium=Math.round(sendData.netPremiumAB+sendData.tax)
        sendData.tax12=sendData.LP*12/100
        sendData.tax18=(sendData.netPremiumAB-sendData.LP)*18/100
        sendData.formId=receivedData.formId
        if(receivedData.formId=="10"){
            sendData.finalPremium=Math.round(sendData.netPremiumAB+sendData.tax12+sendData.tax18)
        }
    }
    return sendData
}

const getQuoteQueryRecords=(startDate,endDate,isWebUser,callback)=>{
    const matchQuery={}
    if(startDate && endDate){
        matchQuery["createdAt"]={
            $gte:new Date(startDate),
            $lte:new Date(endDate),
        }
    }
    if(isWebUser!=="all"){
        matchQuery["isWebUser"]=isWebUser;
    }
    QuoteQueryRecords.aggregate([
    //   {
    //     $match: matchQuery,
    //   },
    //   {
    //     $group: {
    //       _id: "$formId",
    //       vehicleName: { $first: "$vehicle" },
    //       countVehicle: {
    //         $sum: 1,
    //       }
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       vehicleName: 1,
    //       countVehicle: 1,
    //     },
    //   },
        {
    $match:matchQuery,
  },
  {
    $lookup: {
      from: "user",
     	let:{userId:"$userId"},
      pipeline:[
        {
          $match:{
            $expr:{
              $eq:["$_id","$$userId"]
            }
          }
        },
        {
          $project:{
            _id:1,
            name:1
          }
        }
      ],  
      as: "UserData"
    }
  },
  {
    $unwind: {
      path: "$UserData",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
      from: "motorUsers",
      let:{userId:"$userId"},
      pipeline:[
        {
          $match:{
            $expr:{
              $eq:["$_id","$$userId"]
            }
          }
        },
        {
      $project:{
        _id:1,
        name:1,
      }
    }
      ],
      as: "MotorUserData"
    },
    
  },
  {
    $unwind: {
      path: "$MotorUserData",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $group: {
      _id:{
        vehicle:"$vehicle",
        userId:"$userId"
      },
      vehicleName:{$first:"$vehicle"},
      vehicleCount:{$sum:1},
      userName:{$first:"$UserData.name"},
      motorUserName:{$first:"$MotorUserData.name"},
      isWebUser:{$first:"$isWebUser"},
    }
  },
  {
    $project: {
      _id:0,
      vehicleName:1,
      isWebUser:1,
      vehicleCount:1,
      userName:1,
      motorUserName:1
    }
  }
    ]).exec(function(err,data){
        if(err){
            callback(err);
        }else{
            callback(null,data);
        }
    })
}

module.exports = {
  prepareQuoteValue: prepareQuoteValue,
  getQuoteQueryRecords,
};