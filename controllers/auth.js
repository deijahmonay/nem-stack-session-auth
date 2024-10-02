const express = require("express");
const router = express.Router(); // router is captial because its a class
const bcrypt = require('bcrypt')
const User = require('../models/user.js')

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs')
})

router.get('/sign-in', (req, res) => {
  res.render('/auth/sign-in')
})

router.post('/sign-up', async (req, res) => { //allow user to submit signup form
  const userInDatabase = await User.findOne({ username: req.body.username})
  if(userInDatabase) { //checks ro see if the username already exists in database
    return res.send("Username already taken") // returns this message if it does already exist
  }
  if(req.body.password !== req.body.confirmPassword) {
    return res.send('Password and Confirm password must match')
  }
  // console.log(req.body, "before hash")
  const hashedPassword = bcrypt.hashSync(req.body.password, 10)
  req.body.password = hashedPassword
  // console.log(req.body, "after hash")
  const user = await User.create
  res.send(`Thanks for signing-up ${user.username}`)
})

router.post('/sign-in', async(req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username})
  if(!userInDatabase) {
    return res.send("Login failed. Please try again")
  }
  const validPassword = bcrypt.compareSync(
    req.bodypassword, //user password they entered when signing up
    userInDatabase.password, // user password hash we stored
  )
  if(!validPassword) {
    return res.send("Login failed. Please try again")
  }
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
  }
  res.redirect("/")
})

module.exports = router;

