require("dotenv").config();
const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");

const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// MongoDB Model
const Producers = require("../models/Producers");
const Product = require("../models/Product");
const Category = require("../models/Categories");
const subCategory = require("../models/SubCategories");

// READ ALL internal use
router.get("/producers", async (req, res) => {
  try {
    const allProducers = await Producers.find();
    res.json(allProducers);
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
});

// READ ALL Producers with filters ##########################################################
// longitute / latitude / radius , Mandatory
//categoriesId [String], || categoriesId [String], isBioLabel Boolean

router.post(
  "/producers",
  async (req, res) => {
    const {
      longitude,
      latitude,
      radius,
      categoriesId,
      subCategoriesId,
      isBioLabel,
      user_Lat,
      user_Long
    } = req.fields;
    let KM = radius / 1000;
    if (!longitude || !latitude || !radius) {
      return res.status(400).json({ error: "Missing Geoloc parameters" });
    }
    try {
      const searchWithoutDistance = await Producers.find({
        location: {
          $geoWithin: { $centerSphere: [[longitude, latitude], KM / 6371] }
        }
      }).populate({
        path: "products"
      });
      const distance = (long1, lat1, long2, lat2) => {
        const latDiff = lat1 - lat2;
        const longDiff = long1 - long2;
        const MiddleLat = (lat1 + lat2) / 2;
        const Earth = 40075;
        const longDiffToDistance =
          (longDiff * Earth * Math.cos((2 * Math.PI * MiddleLat) / 360)) / 360;
        const latDiffToDistance = (latDiff * Earth) / 360;
        const distance = Math.sqrt(
          Math.pow(latDiffToDistance, 2) + Math.pow(longDiffToDistance, 2)
        );
        return distance;
      };
      let search = JSON.parse(JSON.stringify(searchWithoutDistance));

      for (let i = 0; i < search.length; i++) {
        search[i].distance = distance(
          user_Long,
          user_Lat,
          search[i].loc.longitude,
          search[i].loc.latitude
        );
      }
      //Trier la reponse par distance
      search.sort((a, b) => {
        return a.distance - b.distance;
      });

      if (categoriesId || subCategoriesId || isBioLabel) {
        const FindDataInSearch = (categoryToFind, idcategoryToFind) => {
          const ArrayResult = [];
          for (let i = 0; i < search.length; i++) {
            for (let j = 0; j < idcategoryToFind.length; j++) {
              if (
                search[i].products[0][categoryToFind] == idcategoryToFind[j]
              ) {
                if (isBioLabel) {
                  if (search[i].products[0].labels.length > 0) {
                    for (
                      let k = 0;
                      k < search[i].products[0].labels.length;
                      k++
                    ) {
                      if (search[i].products[0].labels[k] === "bio") {
                        ArrayResult.push(search[i]);
                      }
                    }
                  }
                } else {
                  ArrayResult.push(search[i]);
                }
              }
            }
          }
          return ArrayResult;
        };
        if (subCategoriesId) {
          return res
            .status(200)
            .json(FindDataInSearch("subCategory", subCategoriesId));
        } else if (categoriesId) {
          return res
            .status(200)
            .json(FindDataInSearch("category", categoriesId));
        } else if (isBioLabel) {
          const ArrayResult = [];
          for (let i = 0; i < search.length; i++) {
            for (let k = 0; k < search[i].products[0].labels.length; k++) {
              if (search[i].products[0].labels[k] === "bio") {
                ArrayResult.push(search[i]);
              }
            }
          }
          return res.status(200).json(ArrayResult);
        }
      } else {
        //affichage du retour
        console.log(
          search.map(el => {
            return [el.name, el.distance];
          })
        );
        return res.status(200).json(search);
      }
    } catch (error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }

  // {
  //   "longitude": 2.351462,
  //   "latitude" : 48.856697,
  //   "radius":10
  // }
);

// READ ONE Producer ##########################################################
router.post("/producer/", async (req, res) => {
  let { id } = req.query;
  try {
    const producer = await Producers.findById(id)
      .populate({ path: "products", populate: { path: "subCategory" } })
      .populate({
        path: "products",
        populate: { path: "category", populate: { path: "subCategories" } }
      });
    res.json(producer);
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
});

// CREATE ##########################################################

// MiddleWare function to upload on Cloudinary
const cloudThePhotos = (req, res, next) => {
  const fileKeys = Object.keys(req.files);
  if (fileKeys.length === 0) {
    console.log("no photos to upload");
    return next();
  }
  console.log("we detected", fileKeys.length, "photos to upload on cloudinary");
  let URLsArr = [];

  fileKeys.forEach(fileKey => {
    const file = req.files[fileKey];

    cloudinary.v2.uploader.upload(file.path, (error, result) => {
      if (error) {
        URLsArr.push("error");
      } else {
        console.log(` OK cloudinary - ${fileKey}`);

        URLsArr.push({
          secure_url: result.secure_url,
          public_id: result.public_id
        });
        if (URLsArr.length === fileKeys.length) {
          req.photos = URLsArr;
          return next();
        }
      }
    });
  });
};

router.post(
  "/producer/create",
  isAuthenticated,
  cloudThePhotos,
  async (req, res) => {
    let {
      name,
      street,
      city,
      zipCode,
      longitude,
      latitude,
      cheque,
      cash,
      card,
      description,
      email,
      phone,
      Monday,
      Tuesday,
      Wednesday,
      Thursday,
      Friday,
      Saturday,
      Sunday
    } = req.fields;

    // Fill the TimeSlot if empty
    let timeSlot = [];
    !Monday
      ? timeSlot.push({ Monday: { isOpen: false, availability: "" } })
      : timeSlot.push({ Monday: { isOpen: true, availability: Monday } });
    !Tuesday
      ? timeSlot.push({ Tuesday: { isOpen: false, availability: "" } })
      : timeSlot.push({ Tuesday: { isOpen: true, availability: Tuesday } });
    !Wednesday
      ? timeSlot.push({ Wednesday: { isOpen: false, availability: "" } })
      : timeSlot.push({ Wednesday: { isOpen: true, availability: Wednesday } });
    !Thursday
      ? timeSlot.push({ Thursday: { isOpen: false, availability: "" } })
      : timeSlot.push({ Thursday: { isOpen: true, availability: Thursday } });
    !Friday
      ? timeSlot.push({ Friday: { isOpen: false, availability: "" } })
      : timeSlot.push({ Friday: { isOpen: true, availability: Friday } });
    !Saturday
      ? timeSlot.push({ Saturday: { isOpen: false, availability: "" } })
      : timeSlot.push({ Saturday: { isOpen: true, availability: Saturday } });
    !Sunday
      ? timeSlot.push({ Sunday: { isOpen: false, availability: "" } })
      : timeSlot.push({ Sunday: { isOpen: true, availability: Sunday } });
    const products = []; //No product at creation

    try {
      // MongoDB create new Producer
      const newProducer = new Producers({
        name,
        address: { street, city, zipCode },
        description,
        email,
        phone,
        location: { type: "Point", coordinates: [longitude, latitude] },
        loc: { longitude, latitude },
        meansOPayment: { cheque, cash, card },
        products,
        timeSlot,
        photos: req.photos
      });

      await newProducer.save();
      let messageOK = { _id: newProducer._id, message: "Producer Created" };
      console.log(messageOK);
      res.json(messageOK);
    } catch (error) {
      console.log(error.message);
      res.status(400).json(error.message);
    }
  }
);

// UPDATE ##########################################################
router.post("/producer/update", isAuthenticated, async (req, res) => {
  let id = req.query.id;
  // Check all entries
  let {
    name,
    street,
    city,
    zipCode,
    longitude,
    latitude,
    cheque,
    cash,
    card,
    description,
    email,
    phone,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday
  } = req.fields;
  let timeSlot = [];
  !Monday
    ? timeSlot.push({ Monday: { isOpen: false, availability: "" } })
    : timeSlot.push({ Monday: { isOpen: true, availability: Monday } });
  !Tuesday
    ? timeSlot.push({ Tuesday: { isOpen: false, availability: "" } })
    : timeSlot.push({ Tuesday: { isOpen: true, availability: Tuesday } });
  !Wednesday
    ? timeSlot.push({ Wednesday: { isOpen: false, availability: "" } })
    : timeSlot.push({ Wednesday: { isOpen: true, availability: Wednesday } });
  !Thursday
    ? timeSlot.push({ Thursday: { isOpen: false, availability: "" } })
    : timeSlot.push({ Thursday: { isOpen: true, availability: Thursday } });
  !Friday
    ? timeSlot.push({ Friday: { isOpen: false, availability: "" } })
    : timeSlot.push({ Friday: { isOpen: true, availability: Friday } });
  !Saturday
    ? timeSlot.push({ Saturday: { isOpen: false, availability: "" } })
    : timeSlot.push({ Saturday: { isOpen: true, availability: Saturday } });
  !Sunday
    ? timeSlot.push({ Sunday: { isOpen: false, availability: "" } })
    : timeSlot.push({ Sunday: { isOpen: true, availability: Sunday } });
  const products = []; //No product at creation

  try {
    // MongoDB update Producer
    const producersToUpdate = await Producers.findById(id);

    producersToUpdate.name !== name && (producersToUpdate.name = name);
    producersToUpdate.address.street !== street &&
      (producersToUpdate.address.street = street);
    producersToUpdate.address.city !== city &&
      (producersToUpdate.address.city = city);
    producersToUpdate.address.zipCode !== zipCode &&
      (producersToUpdate.address.zipCode = zipCode);
    producersToUpdate.description !== description &&
      (producersToUpdate.description = description);
    producersToUpdate.email !== email && (producersToUpdate.email = email);
    producersToUpdate.phone !== phone && (producersToUpdate.phone = phone);
    producersToUpdate.location.longitude !== longitude &&
      (producersToUpdate.location.longitude = longitude);
    producersToUpdate.location.latitude !== latitude &&
      (producersToUpdate.location.latitude = latitude);
    producersToUpdate.loc.longitude !== longitude &&
      (producersToUpdate.loc.longitude = longitude);
    producersToUpdate.loc.latitude !== latitude &&
      (producersToUpdate.loc.latitude = latitude);
    producersToUpdate.meansOPayment.cheque !== cheque &&
      (producersToUpdate.meansOPayment.cheque = cheque);
    producersToUpdate.meansOPayment.cash !== cash &&
      (producersToUpdate.meansOPayment.cash = cash);
    producersToUpdate.meansOPayment.card !== card &&
      (producersToUpdate.meansOPayment.card = card);
    producersToUpdate.products !== products &&
      (producersToUpdate.products = products);
    producersToUpdate.timeSlot !== timeSlot &&
      (producersToUpdate.timeSlot = timeSlot);

    console.log("Complete Producer config,then save", producersToUpdate);
    await producersToUpdate.save();
    res.json({ _id: producersToUpdate._id, message: "Producer Updated" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
});

// DELETE ##########################################################
router.post("/producer/delete", isAuthenticated, async (req, res) => {
  let id = req.query.id;
  try {
    const producerToDelete = await Producers.findById(id);

    const productsToDelete = await Product.find({
      producer: producerToDelete.id
    });
    for (let i = 0; i < productsToDelete.length; i++) {
      await productsToDelete[i].remove();
    }

    await producerToDelete.remove();
    res.json({ message: "Producer removed id:" + id });
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
});

module.exports = router;
