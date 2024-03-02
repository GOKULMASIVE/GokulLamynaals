const car = {
    lessThenFiveYears:{
        A:1.751,
        B:1.743,
        C:1.726
    },
    lessThenSevenYears:{
        A:1.795,
        B:1.787,
        C:1.770
    },
    greaterThenSevenYears:{
        A:1.839,
        B:1.830,
        C:1.812
    },
    TP:{
        "<7500":16049,
        "<12000":27186,
        "<20000":35313,
        "<40000":43950,
        ">40000":44242
    },
    iMT23:15,
    accessoriespercent:4,
    noClaimBonus:4,
    PAunnamedPercent:0.05,
    premiumName:"Goods Carrying Vechicles"
}

module.exports={
    data:car
}