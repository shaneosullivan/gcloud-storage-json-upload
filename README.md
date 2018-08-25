# Google Cloud Storage Upload via HTTP JSON Api

This project makes it simple to upload a file to a Google Cloud Storage bucket
using Google's HTTP JSON Api. This is an option you can use instead of having
a dependency on the entire Google SDK toolchain, which can have some downsides.

Mainly, it's huge, over 80MB of node_modules. If you are packaging that into
a deployable package such as an Electron app or an executable created with `pkg`
then that is a huge dependency to pull in when all you want is to enable
uploading a file.

Secondly, the authentication token generation for service accounts is useful
as you can use this token elsewhere with Google's services.

## Usage

### Example

Firstly, see the `example/run_example.js` file for a sample of how to use
the code. Run it using

```
node run_example.js --file=FILE_TO_UPLOAD --service_key=SERVICE_KEY_FILE
```

The `SERVICE_KEY_FILE` is a file containing your generated private key for a
service account. You can generate a new one by going to the URL
`https://console.firebase.google.com/u/0/project/<YOUR PROJECT ID>/settings/serviceaccounts/adminsdk`
and clicking the `Generate new private key` button.

### Code

There are two modules, `auth` and `upload`.

- `auth` authenticates your application using the private key and service account
  email address. It returns a Promise. To use it, do the following:

```
const {auth} = require('gcloud-storage-json-upload');

const privateKey = ......
const serviceAccountEmail = ......

auth(privateKey, serviceAccountEmail).then(token => {
  // Cool, I have a token that lasts for an hour, I can do stuff with it!  
})
```

- `upload` uploads a file to the server. You pass it the file path to upload,
  the token you received from the `auth` function, and the storage ID of the
  Google Cloud storage bucket you are using. This is generally the same as the
  `project_id` field in the private key file.

```
const {auth, upload} = require('gcloud-storage-json-upload');

const filePath = .....
const privateKey = ......
const serviceAccountEmail = ......
const storageID = ......


auth(privateKey, serviceAccountEmail).then(token => {
  upload(filePath, token, storageID).then(() => {
    console.log('Sweet my file uploaded');
  }).catch((err) => {
     console.log('Uh oh, file upload failed with error',err);
  });
})
```
