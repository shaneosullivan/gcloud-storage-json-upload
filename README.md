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

## Two approaches

There are two examples in this project.

- A simple project that is run from the command line. See the `simple-example` folder.
- A small NextJS app with an API endpoint and a React based page for calling that endpoint. See the `nextjs-gcloud-auth-example` folder.
