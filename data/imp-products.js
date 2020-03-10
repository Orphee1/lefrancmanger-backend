require("dotenv").config();

var mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

//Loading mongoDB modelƒ
let Product = require("../models/Product");

let product = require("./product.json");

for (let i = 0; i < product.length; i++) {
  console.log("category:", product[i].category);
  console.log("subCategrory:", product[i].subCategory);
  console.log("weight:", product[i].weight);
  console.log("producer:", product[i].producer);
  console.log("name:", product[i].name);
  console.log("photos:", product[i].photos);
  console.log("labels:", product[i].labels);
  console.log("ingredient:", product[i].ingredient);
  console.log("description:", product[i].description);
  var newProduct = new Product({
    category: product[i].category,
    subCategory: product[i].subCategory,
    weight: product[i].weight,
    producer: product[i].producer,
    name: product[i].name,
    photos: product[i].photos,
    labels: product[i].labels,
    ingredient: product[i].ingredient,
    description: product[i].description
  });

  newProduct.save(function(err, obj) {
    console.log("import-data", obj);
    if (err) {
      console.log("error newProduct" + err);
    } else {
      console.log("saved newProduct " + err);
    }
  });
}
