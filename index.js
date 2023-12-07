const express = require('express')
const app = express()
const env = require('./environment/env')
const database = require('./database/connection')
const bodyParser = require('body-parser')
const dataModel = require('./models/dataModel')
const userModel = require('./models/userModel')
const formValidation = require('./validations/formValidations')
const adminauth = require('./middleware/adminauth')
const cookieParser = require('cookie-parser');
const session = require('express-session');
app.use(
	session({
		secret: 'Mysecret',
		resave: false,
		saveUninitialized: false,
	})
);
app.use(cookieParser());
app.use(express.json());
app.use('/public', express.static('./public'));
app.use(bodyParser.urlencoded({     
    extended: true
  }));
  app.use(express.json())

  app.set('view engine', 'ejs');
  app.set('views', './views');





app.get('/',  async (req, res) => {
      try
      {
            const private_data = []
            const public_data = await dataModel.find({}).lean()
            for(let i=0;i<public_data.length;i++)
            {
                  private_data.push({
                         _id:public_data[i]._id,
                        name:public_data[i].name,
                        email:"*******",
                        phone_number:"**************",
                        requirements:public_data[i].requirements
                  })
            }
            
          res.render('home',{data:private_data})
      }
      catch(error)
      {
        console.log(error.message)
      }
    
})








app.post('/add_data', async (req,res)=>
{
    
    try{
              const data =  await  dataModel.create(req.body)
              res.redirect('/admin_page')
    }
    catch(error)
    {
        console.log(error.message)
    }
})

app.post('/add_user', async (req,res)=>
{
    try{
        const data = await userModel.create(req.body)
        return res.status(200).json(
            {
                message:'User Added Successfully',
                data:data
            })
    }
    catch(error)
    {
        return res.status(400).json(error.message)
    }

})

app.post('/purchase_data', async (req,res)=>{
    try{
        const exist_data = await  userModel.findOne({email:req.body.email}).lean()
        for(let i=0;i<exist_data.data.length;i++)
        {
            if(exist_data.data[i]._id == req.body._id)
            {
                return res.status(400).json('Data Already Purchased')
            }
        }
        const data = await userModel.findOneAndUpdate({email:req.body.email},{$push:{data:req.body.data}})
        res.status(200).json(data)
    }
    catch(error)
    {
        return res.status(400).json(error.message)
    }
})

app.get('/MyLeads/:email' , async (req,res)=>
{
    try
    {
        const param_email = req.params.email
        const user_data = await userModel.findOne({email:param_email}).lean()
        const data_detail = []
        for(let i=0;i<user_data.data.length;i++)
        {
            const data1 = await dataModel.findOne({_id:user_data.data[i]}).lean()
            data_detail.push(data1)
        }
       
        return res.render('MyLeads',{data:data_detail})
    }
    catch(error)
    {
        return res.status(200).json(error.message)
    }
})

app.get('/adminLogin', (req,res)=>
{
    res.render('adminLogin')
})

app.post('/adminLogin', async (req,res)=>
{
    try{
        if(env.admin_id == req.body.admin_id && env.admin_password== req.body.admin_password)
        {
            req.session.admin_id = req.body.admin_id
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
app.get('/adminLogout', async (req,res)=>{
    try{
        req.session.destroy()
        return res.redirect('/adminLogin')
    }
    catch(error)
    {
        return res.status(400).json(error.message)
    }
})

app.get('/admin_page',adminauth.adminisLogin, async (req,res)=>{
 

    try
    {
        const data = await dataModel.find({}).lean()
        res.render('adminPage',{data:data})
    }
    catch(error)
    {
        console.log(error.message)
    }
})
app.listen(env.port,()=>
{
    database.databaseConnection();
    console.log(`Server is running on port ${env.port}`)
})





const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
	new GoogleStrategy(
		{
			clientID: env.CLIENT_ID,
			clientSecret: env.CLIENT_SECRET,
			callbackURL: `http://localhost:4000/auth/google/callback`,
		},
		(accessToken, refreshToken, profile, done) => {
			// You can save the user's profile in the database or handle the authentication as needed.
			return done(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});

app.get(
	'/auth/google',
	passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
	'/auth/google/callback',
	passport.authenticate('google', { failureRedirect: '/' }),
	async (req, res) => {
		const exist_user = await userModel
			.findOne({ email: req.user.emails[0].value })
			.lean();
		if (exist_user) {
			res.cookie('user_email', encodeURIComponent(req.user.emails[0].value));
			return res.redirect('/');
		} else {
			req.body.name = req.user.displayName;
			req.body.email = req.user.emails[0].value;
			const google_user = new userModel(req.body);
			const g_user = await google_user.save();
			res.cookie('user_email', encodeURIComponent(req.user.emails[0].value));
			return res.redirect('/');
		}
	}
);
