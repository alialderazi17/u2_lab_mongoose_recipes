const express = require("express")
const router = express.Router()

const middleware = require("../middleware")
const Recipe = require("../models/Recipe")

const recipeRouter = require("../controllers/recipeController")

router.post("/", middleware.isSignedIn, recipeRouter.createRecipe)
router.get("/", recipeRouter.getAllRecipes)
router.get("/new", middleware.isSignedIn, (req, res) => {
  res.render("./recipes/new.ejs")
})
router.get("/:id", middleware.isSignedIn, recipeRouter.getRecipeById)
router.put("/:id", middleware.isSignedIn, recipeRouter.updateRecipeById)
router.delete("/:id", middleware.isSignedIn, recipeRouter.deleteRecipeById)
router.get("/:id/edit", middleware.isSignedIn, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)
  res.render("./recipes/edit.ejs", { recipe })
})
module.exports = router
