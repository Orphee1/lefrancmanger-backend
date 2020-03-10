require("dotenv").config();

var mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

//Loading mongoDB model
let Producer = require("../models/Producers");

let producers = require("./producers.json");

for (let i = 0; i < producers.length; i++) {
  // console.log("name:", producers[i].name);
  // console.log("address:", producers[i].address);
  // console.log("email:", producers[i].email);
  // console.log("phone:", producers[i].phone);
  // console.log("loc:", producers[i].loc);
  // console.log("photos:", producers[i].photos);
  // console.log("products:", producers[i].products);
  // console.log("timeSlot:", producers[i].timeSlot);
  // console.log("meansOPayment:", producers[i].meansOPayment);
  var newProducer = new Producer({
    name: producers[i].name,
    address: producers[i].address,
    email: producers[i].email,
    phone: producers[i].phone,
    location: producers[i].location,
    loc: producers[i].loc,
    photos: producers[i].photos,
    description: producers[i].description,
    products: producers[i].products,
    timeSlot: producers[i].timeSlot,
    meansOPayment: producers[i].meansOPayment
  });

  newProducer.save(function(err, obj) {
    console.log("import-data", obj);
    if (err) {
      console.log("error newProducer" + err);
    } else {
      console.log("saved newProducer " + err);
    }
  });
}
