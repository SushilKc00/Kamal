const express =require("express")
const router = express.Router();


router.post('/fooddata',(req,res)=>{
    try {
        res.send([global.foodyDatas,global.foodyCategory])
    } catch (error) {
        console.log(error)
        res.send("server error")
    }
})

module.exports =router