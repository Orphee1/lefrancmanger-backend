// function cloudUpload(req) {
cloudUpload = req => {
  const cloudinary = require("cloudinary").v2;
  let URLsArr = [];

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  console.log("cloudUpload", req);
  const fileKeys = Object.keys(req.files);
  if (fileKeys.length === 0) {
    console.log("cloudUpload :no photos to upload");
    return URLsArr;
  }
  console.log(
    "cloudUpload-Detected",
    fileKeys.length,
    "photos to upload on cloudinary"
  );

  fileKeys.forEach(fileKey => {
    const file = req.files[fileKey];
    console.log("filekey", fileKey, "photo", file.name, file.path);

    // cloudinary.v2.uploader.upload(file.path, (error, result) => {
    cloudinary.uploader.upload(file.path, (error, result) => {
      if (error) {
        // return res.json({ error: `Upload Error` });
        URLsArr.push("error");
      } else {
        console.log("cloudUpload OK :", file.name, result);
        URLsArr.push({
          secure_url: result.secure_url,
          public_id: result.public_id
        });
        if (URLsArr.length === fileKeys.length) {
          console.log("cloudUpload result:", URLsArr);
          return URLsArr;
        }
      }
    });
  });

  //     cloudinary.uploader.upload(
  //       file.path,
  //       {
  //         folder: "lefrancmanger"
  //       },
  //       (error, result) => {
  //         if (error) {
  //           results[fileKey] = {
  //             success: false,
  //             error: error
  //           };
  //         } else {
  //           results[fileKey] = {
  //             success: true,
  //             result: result
  //           };
  //         }
  //         if (Object.keys(results).length === files.length) {
  //           // result[filekey].result.secure_url
  //           console.log(results);
  //           return results;
  //         }
};

module.exports = cloudUpload;
