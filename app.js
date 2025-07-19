const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")


let app=express()

app.get("/",(req,res)=>{
    res.send("hello")
})

app.listen(3030,()=>{
    console.log("Server running")
})