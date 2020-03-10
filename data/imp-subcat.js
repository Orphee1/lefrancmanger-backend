require("dotenv").config();

var mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

//Loading mongoDB modelƒ
let SubCategory = require("../models/SubCategories");

let subcategory = require("./subcategory.json");

for (let i = 0; i < subcategory.length; i++) {
  var newsubcategory = new SubCategory({
    name: subcategory[i].name,
    categories: subcategory[i].categories
  });

  newsubcategory.save(function(err, obj) {
    console.log("import-data", obj);
    if (err) {
      console.log("error newsubcategory" + err);
    } else {
      console.log("saved newsubcategory " + err);
    }
  });
}
