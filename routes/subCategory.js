const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");

//MongoDBModel
const SubCategory = require("../models/SubCategories");
const Category = require("../models/Categories");

// READ
router.get("/subCategory", async (req, res) => {
  try {
    const allSubCategories = await SubCategory.find();
    res.status(200).json(allSubCategories);
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});
// CREATE
router.post("/subCategory/create", isAuthenticated, async (req, res) => {
  // id de la Category de rattachement transmis en param
  let id = req.query.id;
  const { name, description } = req.fields;

  try {
    const newSubCategory = new SubCategory({
      name: name,
      description: description,
      category: id
    });

    await newSubCategory.save();

    // Identification de la category à renseigner
    const categoryToUpdate = await Category.findById(id);
    console.log(categoryToUpdate);

    const arrayToUpdate = categoryToUpdate.subCategories;

    // Ajout de la subCategory;
    arrayToUpdate.push(newSubCategory);

    await categoryToUpdate.save();

    res
      .status(200)
      .json({ _id: newSubCategory._id, message: "subCategory created" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

// UPDATE
router.post("/subCategory/update", isAuthenticated, async (req, res) => {
  // id de la subCategory
  let id = req.query.id;
  // id de la category de rattachement transmis en param
  let categoryId = req.query.categoryId;
  const { name, description } = req.fields;

  try {
    // Identification de la subCategory
    let subCategoryToUpdate = await SubCategory.findById(id);
    if (subCategoryToUpdate) {
      if (name) {
        subCategoryToUpdate.name = name;
      }
      if (description) {
        subCategoryToUpdate.description = description;
      }

      await subCategoryToUpdate.save();

      res
        .status(200)
        .json({ _id: subCategoryToUpdate._id, message: "subCategory updated" });
    } else {
      res.status(400).json({ message: "subCategory not found " });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});
// DELETE
router.post("/subCategory/delete", isAuthenticated, async (req, res) => {
  //id de la subcategory
  let id = req.query.id;
  try {
    // identification de la subCategory
    let subCategoryToDelete = await SubCategory.findById(id);
    if (subCategoryToDelete) {
      subCategoryToDelete.remove();

      // Identification de la Category associée
      let categoryToUpdate = await Category.findById(
        subCategoryToDelete.category
      );

      // remove de la subCategory
      for (let i = 0; i < categoryToUpdate.subCategories.length; i++) {
        let idToCompare = categoryToUpdate.subCategories[i].toString();
        if (idToCompare === id) {
          categoryToUpdate.subCategories.splice(i, 1);

          await categoryToUpdate.save();
        }
      }
      res.status(400).json({ message: "subCategory removed" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
