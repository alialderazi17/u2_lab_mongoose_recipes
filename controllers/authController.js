const bcrypt = require("bcrypt")
const User = require("../models/User")

const registerUser = async (req, res) => {
  try {
    const userInDatabase = await User.exists({ email: req.body.email })
    if (userInDatabase) {
      return res.send("❌ Email already taken!")
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.send("❌ Password and Confirm Password must match!")
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12)
    await User.create({
      email: req.body.email,
      password: hashedPassword,
      first: req.body.first,
      last: req.body.last,
      picture: req.body.picture,
      // passwordHistory: [hashedPassword],
    })

    // res.send(`🙏 Thanks for signing up, ${req.body.first}!`)
    res.render("./auth/thanks.ejs")
  } catch (error) {
    console.error("⚠️ An error has occurred registering a user!", error.message)
  }
}

const signInUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.send("❌ There is no registered user with that email!")
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
      return res.send("❌ Incorrect Password!, please try again")
    }
    req.session.user = {
      email: user.email,
      _id: user._id,
    }
    req.session.save(() => {
      // res.send(`👋 Thanks for signing in, ${user.first}!`)
      res.redirect(`/users/${user._id}`)
    })
  } catch (error) {
    console.error("⚠️ An error has occurred signing in a user!", error.message)
  }
}

const signOutUser = async (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect("/")
    })
  } catch (error) {
    console.error("⚠️ An error has occurred signing out!", error.message)
  }
}
const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.send("❌ No user with that ID exists!")
    }
    const validPassword = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    )
    if (!validPassword) {
      return res.send("❌ Your old password was not correct! Please try again.")
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.send("❌ Password and Confirm Password must match")
    }
    const matchingOldAndNew = await bcrypt.compare(
      req.body.newPassword,
      user.password
    )
    if (matchingOldAndNew) {
      return res.send("❌ Your new password cannot be the old one!")
    }
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 12)
    user.password = hashedPassword
    await user.save()
    // res.send(`✅ Your password has been updated, ${user.first}!`)
    res.render("./auth/confirm.ejs")
  } catch (error) {
    console.error(
      "⚠️ An error has occurred updating a user's password!",
      error.message
    )
  }
}
module.exports = {
  registerUser,
  signInUser,
  signOutUser,
  updatePassword,
}
