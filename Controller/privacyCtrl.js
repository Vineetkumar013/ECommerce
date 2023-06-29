const policy = require('../Model/privacyModel')




exports.addPrivacy = async (req,res) =>{
    try{
   const policyData  =    await policy.create({privacy: req.body.privacy});
     res.status(200).json({
        data : policyData,
       message: " Policy Added "
     })
    }
    catch(err)
    {
        console.log(err);
        res.status(400).send({message: err.message})
    }
}


exports.getPrivacy = async(req,res) => {
    try {
        const data = await policy.find();
        console.log(data[0].privacy)
        res.status(200).json({
            privacy  : data[0] 
        })
        
    }catch(err)
    {
        res.status(400).send({mesage : err.mesage});
    }
}



exports.updatePolicy = async (req, res ) => {
    try {
       console.log(req.body.privacy)
        const UpdatedPolicy = await policy.findOneAndUpdate({_id: req.params.id}, {
        privacy : req.body.privacy
        }).exec();
        console.log(UpdatedPolicy);
        res.status(200).json({
            message: "Contact Update" 
        })  
    }catch(err)
    {
       console.log(err)
       res.status(401).json({
        mesage: err.mesage
       })
    }
}


exports.DeletePolicy = async(req,res) => {
    try {
    const id = req.params.id; 
    await policy.deleteOne({_id: id});
    res.status(200).send({message: "Policy  deleted "})
    }catch(err){
      console.log(err); 
      res.status(400).send({message: err.message})
    }
}