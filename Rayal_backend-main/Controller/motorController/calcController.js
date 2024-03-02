const puppeteer = require("puppeteer");
const path = require('path');
const SERVER_URL = process.env.SERVER_URL;
const calcService=require('../../service/motorService/calcService')

const calculateQuote=async(req,res)=>{
    var body=req.body
    console.log(body)
    let prepareQuoteValues=await calcService.prepareQuoteValue(body,req?.userId)
    console.log("prepareQuoteValues",prepareQuoteValues)
    if(!prepareQuoteValues.error){
        var keyvalue=""
        body=prepareQuoteValues.data
        await Object.entries(body).forEach(([key, value]) => {
            if(value!=("" || null || undefined)){
                keyvalue=keyvalue ? keyvalue +`&${key}=${value}` : `${key}=${value}`
            }
        });
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(`${SERVER_URL}/quote/calculateQuote/renderHtml?${keyvalue}`);
        let dir=__dirname.split('Controller/motorController')
        await page.pdf({
            path: path.join(dir[0],`pdfGenerate/assets/reports/pdfs/${req.body.quoteID}.pdf`),
            printBackground: true,
        });
        await browser.close();
        res.status(200).send({
            error:false,
            data:process.env.SERVER_URL+`/reports/pdfs/${req.body.quoteID}.pdf`,
        })
    }else{
        res.status(200).send({
            error:true,
            message:"Something Went Wrong. Please try again"
        })
    }
    
}

const calculateQuoteValues=async(req,res)=>{
    var body=req.body
    console.log(body)
    let prepareQuoteValues=await calcService.prepareQuoteValue(body,req?.userId)
    console.log("prepareQuoteValues",prepareQuoteValues)
    if(!prepareQuoteValues.error){
        var keyvalue=""
        body=prepareQuoteValues.data
        body.quotePath=process.env.SERVER_URL+`/reports/pdfs/${req.body.quoteID}.pdf`
        res.status(200).send({
            error:false,
            data:prepareQuoteValues.data,
        })
        await Object.entries(body).forEach(([key, value]) => {
            if(value!=("" || null || undefined)){
                keyvalue=keyvalue ? keyvalue +`&${key}=${value}` : `${key}=${value}`
            }
        });
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(`${SERVER_URL}/quote/calculateQuote/renderHtml?${keyvalue}`);
        let dir=__dirname.split('Controller/motorController')
        await page.pdf({
            path: path.join(dir[0],`pdfGenerate/assets/reports/pdfs/${req.body.quoteID}.pdf`),
            printBackground: true,
        });
        await browser.close();
    }else{
        res.status(200).send({
            error:true,
            message:"Something Went Wrong. Please try again"
        })
    }
    
}
const downloadQuote=async(req,res)=>{
    const body=req.body
    // const browser = await puppeteer.launch({ headless: true });
    // const page = await browser.newPage();
    // await page.goto(`${SERVER_URL}/quote/calculateQuote/renderHtml?data=${body}`);
    // let dir=__dirname.split('controller')
    // await page.pdf({
    //     path: path.join(dir[0],`pdfGenerate/assets/reports/pdfs/${req.body.quoteID}.pdf`),
    //     printBackground: true,
    // });
    // await browser.close();
    res.download(`pdfGenerate/assets/reports/pdfs/${req.body.quoteID}.pdf`)
}

const calculatePremiumAmount=async(req,res)=>{
    const body=req.body
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`${SERVER_URL}/quote/calculateQuote/renderHtml?data=${body}`);
    let dir=__dirname.split('Controller/motorController')
    await page.pdf({
        path: path.join(dir[0],`pdfGenerate/assets/reports/pdfs/${req.body.quoteID}.pdf`),
        printBackground: true,
    });
    await browser.close();
    res.download(`pdfGenerate/assets/reports/pdfs/${req.body.quoteID}.pdf`)
}

// added by gokul..
const getQuoteQueryRecords=(req,res)=>{
    const startDate=req.headers["startdate"];
    const endDate=req.headers["enddate"];
    const isWebUser=req.headers["iswebuser"];
    calcService.getQuoteQueryRecords(startDate,endDate,isWebUser,function(error,data){
        if(error){
            res.status(500).send({error:true,message:"Something went wrong"})
        }else{
            res.status(200).send({
                error:false,
                data:data,
            })
        }
    })
}


module.exports={
    calculateQuote:calculateQuote,
    calculateQuoteValues:calculateQuoteValues,
    downloadQuote:downloadQuote,
    calculatePremiumAmount:calculatePremiumAmount,
    getQuoteQueryRecords
}