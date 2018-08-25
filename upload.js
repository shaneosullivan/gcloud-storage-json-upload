const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

// Upload a file to Google Cloud Storage.
// - filePath: The path to the file to upload
// - gcToken: The Google Cloud authentication token retrieved using the 'auth' module in this library.
// - storageID: The ID of your storage bucket.  Get this in your Google Cloud console
//              at https://console.cloud.google.com/storage/ .  It looks like "{PROJECT_ID}.appspot.com",
//              omit the ".appspot.com"
function uploadFile(filePath, gcToken, storageID) {
  return new Promise((resolve, reject) => {
    const fileName = encodeURIComponent(path.basename(filePath));
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    const url = `https://www.googleapis.com/upload/storage/v1/b/${storageID}.appspot.com/o?uploadType=media&name=${fileName}`;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/csv",
        "Content-Length": fileSizeInBytes,
        Authorization: `Bearer ${gcToken}`
      },
      body: fs.createReadStream(filePath)
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        if (!response.error) {
          return resolve(true);
        }
        reject(
          `File upload failed: \n\tpath: ${filePath}\n\terror:${JSON.stringify(
            response.error.errors
          )}`
        );
      })
      .catch(err => {
        reject(err);
      });
  });
}

module.exports = uploadFile;
