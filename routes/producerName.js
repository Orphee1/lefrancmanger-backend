const express = require("express");
const formidableMiddleware = require("express-formidable");

const router = express.Router();
router.use(formidableMiddleware());

// MongoDB Model
const Producers = require("../models/Producers");

// Route read by name
router.post("/producerName", async (req, res) => {
  // console.log("route producerName OK");

  try {
    let name = req.fields.name;
    console.log(name);

    const producer = await Producers.findOne({ name });

    if (producer) {
      res.status(200).json(producer);
    } else {
      res.json({ message: "producer not found" });
      alert("producer not found");
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
});

module.exports = router;
