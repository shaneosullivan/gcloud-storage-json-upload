# Google Cloud Storage Auth API in NextJS Example

This is an example [NextJS](https://nextjs.org) application that shows how to
create an API endpoint that generates an authentication token for uploading
a file to [Google Cloud Storage](https://cloud.google.com/storage/). It does
this by authenticating with the OAUTH endpoint, and does not require installing
the Firebase Admin SDK, which is quite large and, for this use case, quite
unnecessary.

It also shows a simple example of how to use the token to upload a text file,
though of course you can upload any kind of file.

### Requirements

You need a Google Cloud developer account, and a Firebase project with
a `Storage` instance created.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You'll see a button saying `Generate Token`. This will not work yet, as you
need to provide the authentication configuration for your own
Google Cloud Storage instance.

## Add your authentication

If you already have an API key file for your Google Cloud Storage, replace the
file `src/firebase_private_key.json` with it - look inside that file first and
make sure that the file you're using has the same parameters in the JSON object.

If you do not have an API key, you can generate a new one by going to the URL
`https://console.firebase.google.com/u/0/project/<YOUR PROJECT ID>/settings/serviceaccounts/adminsdk`
and clicking the `Generate new private key` button.

## Using the example site

Click the `Generate Token` button. As long as you have a valid API key in the
`firebase_private_key.json` file, it will generate a new authentication token.

Once this is done, you can click the `Upload` button to upload a simple text file.
If you like, you can edit the contents of the file to be uploaded before uploading it.

## How it works

The `pages/index.tsx` file is a simple React component that displays what you
see in the browser. It calls two services.

- First, it calls the `/api/createStorageToken` endpoint, which returns a string representing the token retrieved from Google Cloud.
- Second, it does a POST to the Google Cloud storage bucket, sending the authentication token and the contents of the file.

The `pages/api/createStorageToken.ts` file is a simple Next API endpoint.
It fakes some local authentication that you should make work before deploying
something like this to production, otherwise anyone could upload to your
storage bucket. It calls the `googleCloudStorageAuth` function to generate
the auth token, creates the URL to the file using the Project ID of your
Google Cloud project, and sends these back to the browser.

The `src/googleCloudStorageAuth.ts` file is where the most interesting code is.
It uses the `jsrsasign` NPM package to sign a request to Google's OAuth
service, using the API key you have provided. It retrieves the auth token and
sends it back to the `createStorageToken` that called it.
