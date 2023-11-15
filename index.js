const express = require('express')
const app = express()
const env = require('./environment/env')
const database = require('./database/connection')
const bodyParser = require('body-parser')
const dataModel = require('./models/dataModel')
const formValidation = require('./validations/formValidations')
app.use(bodyParser.urlencoded({     
    extended: true
  }));
  app.use(express.json())

app.get('/', (req, res) => {

    res.send('Hello From DataKharido')
})


app.post('/admin_login',async (req,res)=>
{
    try{
                 if(env.admin_id == req.body.admin_id && env.admin_password== req.body.admin_password)
                 {
                    return res.status(200).json('Admin Logged In')
                 }
                 else
                 {
                    return res.status(400).json('Invalid Credentials')
                 }
    }
    catch(error)
    { 
        return res.status(400).json(error.message)
    }
})


app.post('/add_data', async (req,res)=>
{
    const {error} = formValidation(req.body)
    if(error)
    {
        return res.status(400).json(error.message)
    }
    try{
              const data =  dataModel.create(req.body)
              return res.status(200).json(
                {
                    message:'Data Added Successfully',
                    data:data
                })
    }
    catch(error)
    {
        return res.status(400).json(error.message)
    }
})

app.listen(env.port,()=>
{
    database.databaseConnection();
    console.log(`Server is running on port ${env.port}`)
})