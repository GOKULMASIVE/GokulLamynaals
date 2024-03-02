const newPrivateCar = [
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
            ]
    
        },
        {
            "elementType": "input",
            "dataType": "number",
            "defaultValue": null,
            "placeholder": "CC",
            "isTP":true,
            "isMandate":false,
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
            "defaultValue": "1",
            "placeholder": "Year",
            "isTP":true,
            "isMandate":false,
            "values": [
                {
                    "label": "1",
                    "id": "1"
                },
                {
                    "label": "3",
                    "id": 3
                },
            ]
        },
        {

            "elementType": "select",
            "defaultValue": "0",
            "placeholder": "PA Unnamed Passenger",
            "isTP":true,
            "isMandate":false,
            "values": [
                {
                    "label": "0",
                    "id": "0"
                },
                {
                    "label": "10000",
                    "id": 10000
                },
                {
                    "label": "20000",
                    "id": 20000
                },
                {
                    "label": "30000",
                    "id": 30000
                },
                {
                    "label": "40000",
                    "id": 40000
                },
                {
                    "label": "50000",
                    "id": 50000
                },
                {
                    "label": "60000",
                    "id": 60000
                },
                {
                    "label": "70000",
                    "id": 70000
                },
                {
                    "label": "80000",
                    "id": 80000
                },
    
                {
                    "label": "90000",
                    "id": 90000
                },
    
                {
                    "label": "100000",
                    "id": 100000
                },
    
                {
                    "label": "110000",
                    "id": 110000
                },
                {
                    "label": "120000",
                    "id": 120000
                },
                {
                    "label": "130000",
                    "id": 130000
                }, {
                    "label": "140000",
                    "id": 140000
                },
                {
                    "label": "150000",
                    "id": 150000
                },
                {
                    "label": "160000",
                    "id": 160000
                },
                {
                    "label": "170000",
                    "id": 170000
                },
                {
                    "label": "180000",
                    "id": 180000
                },
                {
                    "label": "190000",
                    "id": 190000
                },
                {
                    "label": "200000",
                    "id": 200000
                },
            ]
        },
        {

            "elementType": "select",
            "defaultValue": "4",
            "placeholder": "Seating Capacity",
            "isTP":true,
            "isMandate":false,
            "values": [
                {
                    "label": "0",
                    "id": 0
                },
                {
                    "label": "1",
                    "id": 1
                },
                {
                    "label": "2",
                    "id": 2
                },
                {
                    "label": "3",
                    "id": 3
                },
                {
                    "label": "4",
                    "id": "4"
                },
                {
                    "label": "5",
                    "id": 5
                },
                {
                    "label": "6",
                    "id": 6
                },
                {
                    "label": "7",
                    "id": 7
                },
                {
                    "label": "8",
                    "id": 8
                },
    
                {
                    "label": "9",
                    "id": 9
                },
    
                {
                    "label": "10",
                    "id": 10
                },
    
                {
                    "label": "11",
                    "id": 11
                },
                {
                    "label": "12",
                    "id": 12
                }
            ]
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
    newPrivateCar:newPrivateCar
}