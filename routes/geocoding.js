const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

//READ
router.post("/geocoding", async (req, res) => {
  console.log("toto");
  console.log(req.fields.address);
  if (req.fields.address) {
    const urlHereApi =
      "https://geocoder.api.here.com/6.2/geocode.json?app_id=" +
      process.env.HERE_API_APP_ID +
      "&app_code=" +
      process.env.HERE_API_APP_CODE +
      "&searchtext=";

    const fetchData = async () => {
      try {
        console.log(urlHereApi);
        const response = await axios.get(urlHereApi + req.fields.address);
        console.log(response);
        return res
          .status(200)
          .json(
            response.data.Response.View[0].Result[0].Location.DisplayPosition
          );
      } catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message });
      }
    };
    fetchData();
    console.log(fetchData());
  } else {
    return res.status(400).json({ message: "req.fields.address is missing" });
  }
});

module.exports = router;
