require("dotenv").config();
const express = require("express");
const cors = require("cors");
const formidable = require("express-formidable");

const mongoose = require("mongoose");

const app = express();
app.use(formidable());

app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

//Loading mongoDB model
require("./models/Producers");
require("./models/Categories");
require("./models/SubCategories");
require("./models/Product");
require("./models/Users");

//loading Routes
const producersRoutes = require("./routes/producers");
const productRoutes = require("./routes/product");
const subCategoryRoutes = require("./routes/subCategory");
const categoryRoutes = require("./routes/category");
const producerNameRoutes = require("./routes/producerName");
const geocodingRoutes = require("./routes/geocoding");
const userRoutes = require("./routes/user");

//Use routes
app.use(producersRoutes);
app.use(productRoutes);
app.use(subCategoryRoutes);
app.use(categoryRoutes);
app.use(producerNameRoutes);
app.use(geocodingRoutes);
app.use(userRoutes);

//Test Route
app.get("/", async (req, res) => {
  try {
    res.json({ message: "hello LeFrancManger" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server Started", process.env.PORT);
});
