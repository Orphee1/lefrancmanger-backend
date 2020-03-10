require("dotenv").config();

var mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

//Loading mongoDB modelƒ
let Categories = require("../models/Categories");

let category = require("./caterory.json");

for (let i = 0; i < category.length; i++) {
  var newCategorie = new Categories({
    name: category[i].name,
    subCategories: category[i].subCategories
  });

  newCategorie.save(function(err, obj) {
    console.log("import-data", obj);
    if (err) {
      console.log("error newCategorie" + err);
    } else {
      console.log("saved newCategorie " + err);
    }
  });
}

