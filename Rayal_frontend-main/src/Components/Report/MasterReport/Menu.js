const Menu = [
    {
        _id: "Policy Details",
        Submenu: [
            {
                label: 'Policy Date',
                key: 'issueDate'
            },
            {
                label: 'Booking Code',
                key: 'bookingCode'
            },
            {
                label: 'Policy Type',
                key: 'policyType'
            },
            {
                label: 'Product',
                key: 'product'
            },
        ]
    },
    {
        _id: "Customer Details",
        Submenu: [
            {
                label: 'Customer Name',
                key: 'customerName'
            },
            {
                label: 'Mobile',
                key: 'mobileNumber'
            },
            {
                label: 'Email',
                key: 'email'
            }
        ]
    },
    {
        _id: "Vehicle Details",
        Submenu: [
            {
                label: 'Reg Number',
                key: 'registrationNumber'
            },
            {
                label: 'Reg Year',
                key: 'registrationYear'
            },
            {
                label: 'Model',
                key: 'model'
            },
            {
                label: 'GVW',
                key: 'gvw'
            },
            {
                label: 'CC',
                key: 'cc'
            },
            {
                label: 'Make',
                key: 'make'
            },
            {
                label: 'Seat Capacity',
                key: 'seatingCapacity'
            },
            {
                label: 'Fuel Type',
                key: 'fuelType'
            },
        ]
    },
    {
        _id: "Policy Period",
        Submenu: [
            {
                label: 'OD Start Date',
                key: 'odPolicyStartDate'
            },
            {
                label: 'OD End Date',
                key: 'odPolicyEndDate'
            },
            {
                label: 'Od Period',
                key: 'odPolicyPeriod'
            },
            {
                label: 'TP Start Date',
                key: 'tpPolicyStartDate'
            },
            {
                label: 'TP End Date',
                key: 'tpPolicyEndDate'
            },
            {
                label: 'TP Period',
                key: 'tpPolicyPeriod'
            },
        ]
    },
    {
        _id: "Premium Details",
        Submenu: [
            {
                label: 'PA Cover',
                key: 'paCover'
            },
            {
                label: 'OD Discount',
                key: 'odDisc'
            },
            {
                label: 'Od Premium',
                key: 'odPremium'
            },
            {
                label: 'TP Premium',
                key: 'tpPremium'
            },
            {
                label: 'NET Premium',
                key: 'netPremium'
            },
            {
                label: 'Total Premium',
                key: 'totalPremium'
            },
        ]
    },
    {
        _id: "User Payable",
        Submenu: [
            {
                label: 'OD Commision %',
                key: 'payODPer'
            },
            {
                label: 'OD Amount',
                key: 'payODAmount'
            },
            {
                label: 'TP Commision %',
                key: 'payTPPer'
            },
            {
                label: 'TP Amount',
                key: 'payTPAmount'
            },
            {
                label: 'Net Commision %',
                key: 'payNetPer'
            },
            {
                label: 'Net Amount',
                key: 'payNetAmount'
            },
            {
                label: 'Total Payable Amount',
                key: 'totalPayableAmount'
            },
        ]
    },
    {
        _id: "Receivable Payable",
        Submenu: [
            {
                label: 'OD Commision %',
                key: 'recODPer'
            },
            {
                label: 'OD Amount',
                key: 'recODAmount'
            },
            {
                label: 'TP Commision %',
                key: 'recTPPer'
            },
            {
                label: 'TP Amount',
                key: 'recTPAmount'
            },
            {
                label: 'Net Commision %',
                key: 'recNetPer'
            },
            {
                label: 'Net Amount',
                key: 'recNetAmount'
            },
            {
                label: 'Total Receivable Amount',
                key: 'totalReceivableAmount'
            },
        ]
    },

]

export default Menu