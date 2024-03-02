const dao=require("../dao/vehicleMakeDao");

module.exports.postVehicleMake=(clientId,data, next, callback)=>{
    dao.postVehicleMake(clientId,data, next, function(error,result){
        if(error){
            callback(error);
        }else{
            callback(null,{
                error:false,
                data:result,
                message:"Saved Successfully"
            })
        }
    });
}

module.exports.getVehicleMake=(clientId,isAscending, next, callback)=>{
    dao.getVehicleMake(clientId,isAscending, next, function(error,result){
        if(error){
            callback(error);
        }else{
            callback(null,{
                error:false,
                data:result,
                message:null
            });
        }
    });
}

module.exports.putVehicleMake=(id,data, next, callback)=>{
    dao.putVehicleMake(id,data, next, function(error,result){
        if(error){
            callback(error)
        }else{
            callback(null,{
                error:false,
                data:result,
                message:"Updated Successfully"
            })
        }
    });
}

module.exports.deleteVehicleMake=(id, next, callback)=>{
    dao.deleteVehicleMake(id, next, function(err,result){
        if(err){
            callback(err)
        }else{
            callback(null,{
                error:false,
                data:result,
                message:"Deleted Successfully"
            })
        }
    })
}

module.exports.filterVehicleMake=(clientId,data, next, callback)=>{
    dao.filterVehicleMake(clientId,data, next, function(error,result){
        if(error){
            callback(error);
        }else{
            callback(null,{
                error:false,
                data:result,
                message:null
            });
        }
    });
}