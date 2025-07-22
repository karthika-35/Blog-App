const Express = require("express")
const Cors = require("cors")
const Mongoose = require("mongoose")
const Bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("./models/users")
const postModel = require("./models/posts")



let app = Express()
app.use(Express.json())
app.use(Cors())


Mongoose.connect("mongodb+srv://karthika_35:karthika35@cluster0.aa1yfln.mongodb.net/BlogappDb?retryWrites=true&w=majority&appName=Cluster0")
//create a post

app.post("/create",async(req,res)=>{
    let input=req.body

    let token=req.headers.token

    jwt.verify(token,"blogApp",async(error,decoded)=>{
        if (decoded && decoded.email) {

            let result=new postModel(input)
            await result.save()
            res.json({"status":"success"})
            
            
        } else {
            res.json({"status":"Invalid Authentication" })
            
        }
    })
})
//Sign In

app.post("/signIn", async (req, res) => {

    let input = req.body
    let result = userModel.find({ email: req.body.email }).then(
        (items) => {
            if (items.length > 0) {

                const passwordValidator = Bcrypt.compareSync(req.body.password, items[0].password)
                if (passwordValidator) {
                    jwt.sign({ email: req.body.email }, "blogApp", { expiresIn: "1d" },
                        (error, token) => {
                            if (error) {
                                res.json({ "status": "error", "errorMessage": error })
                            } else {
                                res.json({ "status": "success", "token": token, "UserId": items[0]._id })
                            }
                        })
                } else {
                    res.json({ "Status": "Incorrect Password" })
                }


            } else {
                res.json({ "Status": "Invalid email Id" })
            }
        }


    ).catch()
})




//Sign Up
app.post("/signup", async (req, res) => {

    let input = req.body
    let hashedPassword = Bcrypt.hashSync(req.body.password, 10)
    console.log(hashedPassword)
    req.body.password = hashedPassword

    userModel.find({ email: req.body.email }).then(
        (items) => {

            if (items.length > 0) {

                res.json({ "status": "Email Id already exist" })

            } else {

                let result = new userModel(input)
                result.save()
                res.json({ "status": "success" })
            }

        }
    ).catch(
        (error) => { }
    )





})

app.listen(3000, () => {
    console.log("Server running")
})