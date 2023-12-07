const adminisLogin = async (req,res,next)=>
{
    try{
         if(req.session.admin_id){}
         else{
           return  res.redirect("/adminLogin")
         }
         next();
    }
    catch(error)
    {
        console.log(error.message)
    }
}
const adminisLogout = async (req,res,next)=>
{
    try{
         if(req.session.admin_id)
         {
            return res.redirect("/admin_page")
         }
        next();
    }
    catch(error)
    {
        console.log(error.message)
    }
}


module.exports= {
    adminisLogin,
    adminisLogout
}