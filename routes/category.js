const express = require("express");

const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");

//MongoDB model
const Category = require("../models/Categories");
const SubCategory = require("../models/SubCategories");
const Product = require("../models/Product");

// READ ##################################
router.get("/category", async (req, res) => {
  try {
    const allCategories = await Category.find().populate("subCategories");
    res.status(200).json(allCategories);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// CREATE ################################
router.post("/category/create", isAuthenticated, async (req, res) => {
  let { name, description } = req.fields;

  try {
    const newCategory = new Category({
      name,
      description
    });

    await newCategory.save();
    res.status(200).json({ _id: newCategory._id, message: "Category Created" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// UPDATE ################################
router.post("/category/update", isAuthenticated, async (req, res) => {
  let id = req.query.id;
  let name = req.fields.name;
  let description = req.fields.description;

  try {
    let categoryToUpdate = await Category.findById(id);
    if (categoryToUpdate) {
      // modification de la category
      if (name) {
        categoryToUpdate.name = name;
      }

      if (description) {
        categoryToUpdate.description = description;
      }

      await categoryToUpdate.save();

      res
        .status(200)
        .json({ _id: categoryToUpdate._id, message: "Category updated" });
    } else {
      res.status(400).json({ message: "Category not found " });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// DELETE ################################
router.post("/category/delete", isAuthenticated, async (req, res) => {
  let id = req.query.id;
  try {
    let categoryToDelete = await Category.findById(id);
    if (categoryToDelete) {
      // suppression de la category
      categoryToDelete.remove();
      res.json({ message: "category removed" });

      // suppression des subCategories associées
      const subCategoryToDelete = await SubCategory.find({
        category: id
      });
      for (let i = 0; i < subCategoryToDelete.length; i++) {
        await subCategoryToDelete[i].remove();
      }

      // await SubCategory.remove();
    } else {
      res.status(400).json({ message: "category not found " });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
