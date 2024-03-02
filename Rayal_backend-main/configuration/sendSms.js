
const fromNumber="+19288822981"
const accountSid = 'ACf9d061f9403b1b28ad9ad6bbd5a140f7'; 
const authToken ="84a09e151689191c27870a41f6d44a3e"; 

const client = require('twilio')(accountSid, authToken); 
const axios=require('axios')

module.exports={
  sendOtpMobile
}

async function sendOtpMobile(data){
  // try{
    let smsurl=`https://api.textlocal.in/send/?apiKey=NGUzNTc1MzE3MTM3NDI1YTRlNGY3NTU4NDg2ZDdhNzc=&sender=RAYAL&numbers=${data.mobileNumber}&message=Dear ${data.name},%nThanks for registering with us. Your OTP for verification is: ${data.otp} - Rayal Brokers India Pvt Ltd`
    
    await axios.get(smsurl).then(()=>{
      return "success"
    }).catch(e=>{
      return 'something Went Wrong on SMS'
    })
    // client.messages 
    // .create({ 
    //     body: `hi ${data.name} \n your otp is ${data.otp}`,  
    //     to: data.mobileNumber,
    //     from:fromNumber 
    // }) .then(
    //   (message) => {
    //     return message
    //   }
    // )
  // }catch(e){
  //   return e
  // }
}