const adminService=require('../../service/motorService/adminService')

var somethingWentWrong={
    error:true,
    message:"Somthing Went Wrong",
}
const dynamic_json=[
    {
         "elementType":"input",
         "dataType":"string",
         "defaultValue":null,
         "placeholder":"placeholder",
         "validation":() =>{
            
         }
      },
      {
         "elementType":"checkbox",
         "defaultValue":false,
         "placeholder":"placeholder",
         "validation":() =>{
            "return value;"
         }
      },
      {
         "elementType":"radio",
         "defaultValue":null,
         "placeholder":"placeholder",
         "validation":() =>{
            "return value;"
         },
         "values":[
            {
               "label":"item1",
               "id":"item_1"
            }
         ]
      },
      {
         "elementType":"select",
         "defaultValue":"id_1",
         "placeholder":"placeholder",
         "validation":(value) =>{
            "return value;"
         },
         "values":[
            {
               "label":"item1",
               "id":"item_1"
            }
         ]
      }
   ]

const getContactUs =async(req,res,next)=>{
    adminService.getContactUs(next,function(err,data){
        if(err){
            somethingWentWrong.err=err
            res.status(500).send(somethingWentWrong)
        }else{
            res.status(200).send({
                error:false,
                data:data
            })
        }
    })
}

const postContactUs =async(req,res,next)=>{
    var receivedData=req.body
    if(receivedData._id){
        adminService.updateContactUs(receivedData,next,function(err,data){
            if(err){
                somethingWentWrong.err=err
                res.status(500).send(err)
            }else{
                res.status(200).send(data)
            }
        })
    }else{
        adminService.postContactUs(receivedData,next,function(err,data){
            if(err){
                console.log(err)
                somethingWentWrong.err=err
                res.status(500).send(err)
            }else{
                console.log(err)
                res.status(200).send(data)
            }
        })
    }
}

const dynamicJsonValue=async(req,res)=>{
    res.status(200).send({
        error:false,
        data:dynamic_json
    })
}

const postTP =async(req,res,next)=>{
    var receivedData=req.body
    if(receivedData._id){
        adminService.updateTP(receivedData,next,function(err,data){
            if(err){
                somethingWentWrong.err=err
                res.status(500).send(err)
            }else{
                res.status(200).send(data)
            }
        })
    }else{
        adminService.postTP(receivedData,next,function(err,data){
            if(err){
                console.log(err)
                somethingWentWrong.err=err
                res.status(500).send(err)
            }else{
                res.status(200).send(data)
            }
        })
    }
}

const getTP =async(req,res,next)=>{
    adminService.getTP(next,function(err,data){
        if(err){
            somethingWentWrong.err=err
            res.status(500).send(somethingWentWrong)
        }else{
            res.status(200).send({
                error:false,
                data:data
            })
        }
    })
}

module.exports={
    getContactUs,
    postContactUs,
    dynamicJsonValue,
    postTP,
    getTP
}