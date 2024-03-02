const car = {
    lessThenFiveYears:{
        A:1.680,
        B:1.672,
        C:1.656
    },
    lessThenSevenYears:{
        A:1.722,
        B:1.714,
        C:1.697
    },
    greaterThenSevenYears:{
        A:1.764,
        B:1.756,
        C:1.739
    },
    seatingCapacity:{
        "<=18":350,
        "<=36":450,
        "<=60":550,
        ">60":80
    },
    educationalBus:{
        TP:12192,
        perPassenger:745
        // TpPerpassenger:745
    },
    otherBus:{
        TP:12192,
        perPassenger:877
    },
    iMT23:15,
    accessoriespercent:4,
    noClaimBonus:4,
    PAunnamedPercent:0.05,
    premiumName:"Bus Premium"
}

module.exports={
    data:car
}