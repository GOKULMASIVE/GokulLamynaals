const car = {
    gcv:{
        lessThenFiveYears:{
            A:1.664,
            B:1.656,
            C:1.640
        },
        lessThenSevenYears:{
            A:1.706,
            B:1.697,
            C:1.681
        },
        greaterThenSevenYears:{
            A:1.747,
            B:1.739,
            C:1.722
        },
        TP:4492,
        tppd:-150,
        perPassenger:0,
        accessoriespercent:4,
        iMT23:15,
        noClaimBonus:4,
        PAunnamedPercent:0.05,
        premiumName:"Three Wheeler Premium"
    },
    pcv:{
        lessThenFiveYears:{
            A:1.278,
            B:1.272,
            C:1.260
        },
        lessThenSevenYears:{
            A:1.310,
            B:1.304,
            C:1.292
        },
        greaterThenSevenYears:{
            A:1.342,
            B:1.336,
            C:1.323
        },
        TP:2539,
        tppd:-150,
        perPassenger:1214,
        accessoriespercent:4,
        noClaimBonus:4,
        iMT23:15,
        PAunnamedPercent:0.05,
        premiumName:"Three Wheeler Premium(PCV)"
    }
    
}

module.exports={
    data:car
}