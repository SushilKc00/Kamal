const express =require("express")

const router =express.Router();
const Order = require("../Model/Order.js")

router.post('/orderData', async(req,res)=>{
    let data  =req.body.order_data;
    await data.splice(0,0,{Order_date: req.body.order_date})
 

    //if email id not exist in db then create else insert many

    let eId =await Order.findOne({'email' :req.body.email})
    if(eId === null){
        try {
            await Order.create({
                email:req.body.email,
                order_data: [data]
            }).then(()=>{
                res.json({success:true})
            })
        } catch (error) {
            console.log(error.message)
            res.send ("server error")
        }
    }else{
        try {
            await Order.findOneAndUpdate({email:req.body.email},
                {$push:{order_data :data}}).then(()=>{
                    res.json({success:true})
                })
        } catch (error) {
            res.send("server error" , error.message)
        }
    }
})

router.post ('/myOrderedData', async(req,res)=>{
    try {
       // console.log(req.body.email)
        let myData =await  Order.findOne({'email': req.body.email})
        res.json({orderData:myData})
    } catch (error) {
        res.status(400).json({error: "myorder error"})
    }
})

module.exports =router;