const validation =(req)=>{
    if(req && req.body){
        for(const key in req.body){
            if(!req.body[key]){
                return {
                    status:false,
                    message:`${key} field is required`
                }
            }
        }
        return{
            status:true
        }
    }
}
module.exports = validation
