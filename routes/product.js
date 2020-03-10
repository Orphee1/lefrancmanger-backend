const express = require("express");
const formidableMiddleware = require("express-formidable");

const router = express.Router();
router.use(formidableMiddleware());
const cloudinary = require("cloudinary").v2;
const isAuthenticated = require("../middlewares/isAuthenticated");

// configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// // MongoDB Model
const Product = require("../models/Product");
const Producers = require("../models/Producers");
const Category = require("../models/Categories");
const SubCategory = require("../models/SubCategories");

// Middleware upload
const uploadPicture = (req, res, next) => {
  try {
    if (Object.keys(req.files).length) {
      // console.log("coucou" + req.files);

      cloudinary.uploader.upload(
        req.files.pictures.path,
        async (error, result) => {
          if (error) {
            return res.json({ error: "Upload Error" });
          } else {
            req.pictures = [
              {
                secure_url: result.secure_url,
                public_id: result.public_id
              }
            ];

            next();
          }
        }
      );
    } else {
      next();
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: "an error occurred uploading picture" });
  }
};

// READ ################################################################

router.get("/product", async (req, res) => {
  console.log("route get product OK");
  try {
    const allProducts = await Product.find();
    res.json(allProducts);
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
});

// CReate ################################
router.post(
  "/product/create",
  isAuthenticated,
  uploadPicture,
  async (req, res) => {
    console.log("create demandé");
    try {
      let {
        category,
        subCategory,
        weight,
        name,
        labels,
        ingredient,
        description
      } = req.fields;
      const newProduct = new Product({
        category,
        subCategory,
        weight,
        name,
        labels,
        ingredient
      });
      newProduct.description = JSON.parse(req.fields.description);
      if (req.pictures) {
        newProduct.photos = req.pictures;
      }
      newProduct.producer = req.query.id;
      console.log("hello" + req.query.id);

      await newProduct.save();

      // Identification du producteur à renseigner
      const producerToUpdate = await Producers.findById(req.query.id);
      const productsListToUpdate = producerToUpdate.products;

      // Ajout du produit
      productsListToUpdate.push(newProduct);

      await producerToUpdate.save();
      // console.log(producerToUpdate);
      // console.log(req.query.id);

      res.status(200).json({ _id: newProduct._id, message: "product created" });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
  }
);

// Update ##################
router.post(
  "/product/update",
  uploadPicture,
  isAuthenticated,
  async (req, res) => {
    let id = req.query.id;
    let producerId = req.query.producerId; // possible envoyer plusieurs query params???
    const {
      category,
      subCategory,
      weight,
      name,
      labels,
      ingredient,
      description
    } = req.fields;

    try {
      let productToUpdate = await Product.findById(id);

      if (productToUpdate) {
        if (category) {
          productToUpdate.category = category;
        }

        if (subCategory) {
          productToUpdate.subCategory = subCategory;
        }

        if (weight) {
          productToUpdate.weight = weight;
        }

        if (name) {
          productToUpdate.name = name;
        }

        if (labels) {
          productToUpdate.labels = labels;
        }

        if (ingredient) {
          productToUpdate.ingredient = ingredient;
        }

        if (description) {
          productToUpdate.description = description;
        }

        if (req.pictures) {
          productToUpdate.photos = req.pictures;
        }

        productToUpdate.producer = producerId; // à tester
        await productToUpdate.save();
        res.status(200).json(productToUpdate); // or ??
        res
          .status(200)
          .json({ _id: productToUpdate._id, message: "product updated" });
      } else {
        res.status(400).json({ message: "product not found" });
      }
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
  }
);
// // Delete ###############
router.post("/product/delete", isAuthenticated, async (req, res) => {
  let id = req.query.id;

  try {
    let productToDelete = await Product.findById(id);

    if (productToDelete) {
      //Identification du producer associé
      let producerToUpdate = await Producers.findById(productToDelete.producer);

      // Suppression du produit de la table du producer associé
      for (let i = 0; i < producerToUpdate.products.length; i++) {
        let idToCompare = producerToUpdate.products[i].toString();
        if (idToCompare === id) {
          producerToUpdate.products.splice(i, 1);
          await producerToUpdate.save();
        }
      }

      res.status(200).json({ message: "Product removed" });
      await productToDelete.remove();
    } else {
      res.status(400).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
