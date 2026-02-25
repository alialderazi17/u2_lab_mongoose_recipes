const Recipe = require("../models/Recipe")
const bcrypt = require("bcrypt")
const User = require("../models/User")

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const recipes = await Recipe.find({ author: user._id })
    const data = {
      _id: user._id,
      first: user.first,
      last: user.last,
      picture: user.picture,
      recipes: recipes,
    }
    // res.send(data)
    res.render("./users/profile.ejs", { user: data })
  } catch (error) {
    console.error(`⚠️ An error occurred finding a user!`, error.message)
  }
}
// i made this function so i can get the user ID in insomnia xD
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
    res.json(users)
  } catch (error) {
    res.status(500).json({
      message: "⚠️ An error occurred getting all users!",
      error: error.message,
    })
  }
}

module.exports = {
  getUserById,
  getAllUsers,
}
