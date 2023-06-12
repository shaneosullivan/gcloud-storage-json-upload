const fs = require("fs");
const minimist = require("minimist");
const auth = require("../auth");
const upload = require("../upload");

const args = minimist(process.argv.slice(2), {
  string: ["file", "service_key"],
});

if (!args.file || !fs.existsSync(args.file)) {
  console.log("Error: Provide a valid file to upload with --file=FILENAME");
} else if (!args.service_key || !fs.existsSync(args.service_key)) {
  console.log(
    "Error: Provide the path to the service key file for your project with --service_key=FILENAME"
  );
} else {
  const service = JSON.parse(fs.readFileSync(args.service_key));
  auth(service.private_key, service.client_email)
    .then((token) => {
      upload(args.file, token, service.project_id)
        .then(() => {
          console.log("Successfully uploaded file");
        })
        .catch((err) => {
          console.log("Error: failed to upload file", err);
        });
    })
    .catch((err) => {
      console.log("Authentication failed", err);
    });
}
