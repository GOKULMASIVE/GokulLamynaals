const goodsCarringMoreThanThreeWheeler = [

    {
        "elementType": "select",
        "defaultValue": "Full",
        "placeholder": "Policy Type",
        "isTP":true,
        "isMandate":false,
        "values": [
            {
                "label": "Full",
                "id": "Full"
            },
            {
                "label": "TP",
                "id": "TP"
            },

        ]
    },
    {
        "elementType": "input",
        "dataType": "number",
        "defaultValue": null,
        "placeholder": "IDV",
        "isTP":false,
        "isMandate":false,
    },
    {
        "elementType": "input",
        "dataType": "number",
        "defaultValue": null,
        "placeholder": "Year Of Manufacture",
        "isTP":false,
        "isMandate":false,
    },
    {

        "elementType": "select",
        "defaultValue": null,
        "placeholder": "Zone",
        "isTP":false,
        "isMandate":false,
        "values": [
            {
                "label": "A",
                "id": "A"
            },
            {
                "label": "B",
                "id": "B"
            },
            {
                "label": "C",
                "id":"C"
            }
        ]
    },
    {
        "elementType": "input",
        "dataType": "number",
        "defaultValue": "0",
        "placeholder": "GVW",
        "isTP":true,
        "isMandate":false,
    },
    {
        "elementType":"radio",
        "defaultValue":"1",
        "placeholder":"IMT 23",
        "isTP":false,
        "isMandate":false,
        "values":[
            {
                "label":"Yes",
                "id":"1"
            },
            {
            "label":"No",
                "id":2
            }
        ]
        },
        {
            "elementType":"select",
            "defaultValue":"2",
            "placeholder":"LPG Kit",
            "isTP":false,
            "isMandate":true,
            "values":[
               {
                  "label":"Yes",
                  "id":"1"
               },
               {
                "label":"No",
                  "id":"2"
               }
            ]
         },
         {
            "elementType":"radio",
            "defaultValue":"",
            "placeholder":"LPG Kit TYPE",
            "isTP":false,
            "isMandate":true,
            "values":[
               {
                  "label":"Inbuild",
                  "id":"1"
               },
               {
                "label":"Option",
                  "id":"2"
               }
            ]
         },
         {
            "elementType":"input",
            "defaultValue":"0",
            "placeholder":"LPG On Addition",
            "isTP":false,
            "isMandate":true
         },
        {
        "elementType": "input",
        "dataType": "number",
        "defaultValue": "0",
        "placeholder": "Discount on OD Premium(%)",
        "isTP":false,
        "isMandate":false,
    },
    {
        "elementType": "input",
        "dataType": "number",
        "defaultValue": "0",
        "placeholder": "Accessories Value",
        "isTP":false,
        "isMandate":false,
    },
    {

        "elementType": "select",
        "defaultValue": "0",
        "placeholder": "No Claim Bonus(%)",
        "isTP":false,
        "isMandate":false,
        "values": [
            {
                "label": "0",
                "id": "0"
            },
            {
                "label": "20",
                "id": 20
            },
            {
                "label": "25",
                "id": 25
            },
            {
                "label": "35",
                "id": 35
            },
            {
                "label": "45",
                "id": 45
            },
            {
                "label": "50",
                "id": 50
            },
        ]
    },
    {
        "elementType": "input",
        "dataType": "number",
        "defaultValue": "0",
        "placeholder": "Zero Depreciation",
        "isTP":false,
        "isMandate":false,
    },
    {
        "elementType": "input",
        "dataType": "number",
        "defaultValue": "0",
        "placeholder": "PA Owner Driver",
        "isTP":true,
        "isMandate":false,
    },
    {

        "elementType": "select",
        "defaultValue": "0",
        "placeholder": "LL to Paid Driver",
        "isTP":true,
        "isMandate":false,
        "values": [
            {
                "label": "0",
                "id": "0"
            },
            {
                "label": "50",
                "id": 50
            }
        ]
    },
    {
        "elementType": "input",
        "dataType": "number",
        "defaultValue": "0",
        "placeholder": "Coolies/Cleaner",
        "isTP":true,
        "isMandate":false,
    },
    {

        "elementType": "select",
        "defaultValue": null,
        "placeholder": "Company",
        "isTP":true,
        "isMandate":false,
        "values": [
            {
                "label": "Bajaj Allianz General Insurance Co. Ltd.",
                "id": "Bajaj Allianz General Insurance Co. Ltd."
            },
            {
                "label": "Cholamandalam MS General Insurance Co. Ltd.",
                "id": "Cholamandalam MS General Insurance Co. Ltd."
            },
            {
                "label": "Future Generali India Insurance Co. Ltd.",
                "id": "Future Generali India Insurance Co. Ltd."
            },
            {
                "label": "HDFC ERGO General Insurance Co. Ltd.",
                "id": "HDFC ERGO General Insurance Co. Ltd."
            },
            {
                "label": "ICICI Lombard General Insurance Co. Ltd.",
                "id": "ICICI Lombard General Insurance Co. Ltd."
            },
            {
                "label": "IFFCO Tokio General Insurance Co. Ltd.",
                "id": "IFFCO Tokio General Insurance Co. Ltd."
            },
            {
                "label": "Liberty Videocon General Insurance Co. Ltd.",
                "id": "Liberty Videocon General Insurance Co. Ltd."
            },
            {
                "label": "Magma HDI General Insurance Co. Ltd.",
                "id": "Magma HDI General Insurance Co. Ltd."
            },
            {
                "label": "National Insurance Co. Ltd.",
                "id": "National Insurance Co. Ltd."
            },
            {
                "label": "The New India Assurance Co. Ltd.",
                "id": "The New India Assurance Co. Ltd."
            },
            {
                "label": "The Oriental Insurance Co. Ltd.",
                "id": "The Oriental Insurance Co. Ltd."
            },
            {
                "label": "Raheja QBE General Insurance Co. Ltd.",
                "id": "Raheja QBE General Insurance Co. Ltd."
            },
            {
                "label": "Reliance General Insurance Co. Ltd.",
                "id": "Reliance General Insurance Co. Ltd."
            },
            {
                "label": "Royal Sundaram Alliance Insurance Co. Ltd.",
                "id": "Royal Sundaram Alliance Insurance Co. Ltd."
            },
            {
                "label": "SBI General Insurance Co. Ltd.",
                "id": "SBI General Insurance Co. Ltd."
            },
            {
                "label": "Shriram General Insurance Co. Ltd.",
                "id": "Shriram General Insurance Co. Ltd."
            },
            {
                "label": "Tata AIG General Insurance Co. Ltd.",
                "id": "Tata AIG General Insurance Co. Ltd."
            },
            {
                "label": "United India Insurance Co. Ltd.",
                "id": "United India Insurance Co. Ltd."
            },
            {
                "label": "Universal Sompo General Insurance Co. Ltd.",
                "id": "Universal Sompo General Insurance Co. Ltd."
            },
            {
                "label": "Kotak Mahindra General Insurance Co. Ltd.",
                "id": "Kotak Mahindra General Insurance Co. Ltd."
            },
            {
                "label": "Acko General Insurance Limited",
                "id": "Acko General Insurance Limited"
            },
            {
                "label": "DHFL General Insurance Co.Ltd.",
                "id": "DHFL General Insurance Co.Ltd."
            },
            {
                "label": "Edelweiss General Insurance Co.Ltd.",
                "id": "Edelweiss General Insurance Co.Ltd."
            },
            {
                "label": "Go Digit General Insurance Ltd.",
                "id": "Go Digit General Insurance Ltd."
            },

        ]

    },
    {
        "elementType": "input",
        "dataType": "text",
        "defaultValue": null,
        "placeholder": "Customer Name",
        "isTP":true,
        "isMandate":false,
    },
    {
        "elementType": "input",
        "dataType": "text",
        "defaultValue": null,
        "placeholder": "Vehicle Number",
        "isTP":true,
        "isMandate":false,
    },
    {
        "elementType": "input",
        "dataType": "text",
        "defaultValue": null,
        "placeholder": "Make Model",
        "isTP":true,
        "isMandate":false,
    },

]


module.exports={
    goodsCarringMoreThanThreeWheeler:goodsCarringMoreThanThreeWheeler
}