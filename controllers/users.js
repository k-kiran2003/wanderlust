const user = require("../models/user");
//signup form 
module.exports.signupForm = (req, res) => {
    res.render("users/signup.ejs");
}

//signup
module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newuser = new user({
      email, username
    });
    const registeredUser = await user.register(newuser, password)
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust :)");
      res.redirect("/listing");
    })
  }
  catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

//login
module.exports.login = async (req, res) => {

    req.flash("success", "welcome back on Wanderlust ");
    let Url = res.locals.redirectUrl || "/listing";
    res.redirect(Url);
};
//logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listing");
    })
};