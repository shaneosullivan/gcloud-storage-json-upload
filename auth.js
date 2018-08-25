const fetch = require("node-fetch");
const { KEYUTIL, jws } = require("jsrsasign");

// Fetches a new auth token using the instructions at
// https://developers.google.com/identity/protocols/OAuth2ServiceAccount
// and
// https://stackoverflow.com/questions/47230956/how-can-i-retrieve-a-service-account-oauth2-token-from-google-api-with-javascrip

// To generate a new authentication token, which you'll use to upload to the
// Google Cloud Storage HTTP JSON API, you need to provide the
// private key and email of the service account you previously created for the
// relevant storage project
module.exports = function(privateKey, serviceAccountEmail) {
  return new Promise((resolve, reject) => {
    const now = new Date().getTime() / 1000;
    const oneHourFromNow = now + 60 * 60;

    const header = { alg: "RS256", typ: "JWT" };
    const claimSet = {
      iss: serviceAccountEmail,
      scope: "https://www.googleapis.com/auth/devstorage.read_write",
      aud: "https://www.googleapis.com/oauth2/v4/token",
      exp: oneHourFromNow,
      iat: now
    };

    // Cryptographically sign the data packet.
    const token = jws.JWS.sign(
      header.alg,
      header,
      JSON.stringify(claimSet),
      KEYUTIL.getKey(privateKey)
    );

    var parameters =
      "grant_type=" +
      encodeURIComponent("urn:ietf:params:oauth:grant-type:jwt-bearer") +
      "&assertion=" +
      encodeURIComponent(token);

    // Fetch the new auth token from Google's servers
    fetch("https://www.googleapis.com/oauth2/v4/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: parameters
    })
      .then(resp => {
        if (resp.status === 200) {
          return resp.json();
        }
        throw new Error("Failed to get Google Cloud authentication");
      })
      .then(token => {
        // Example successful response
        // {
        //   "access_token" : "1/8xbJqaOZXSUZbHLl5EOtu1pxz3fmmetKx9W8CV4t79M",
        //   "token_type" : "Bearer",
        //   "expires_in" : 3600
        // }
        resolve(token.access_token);
      })
      .catch(err => {
        reject(err);
      });
  });
};
