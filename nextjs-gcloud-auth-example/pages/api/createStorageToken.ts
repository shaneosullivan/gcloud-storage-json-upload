import { NextApiRequest, NextApiResponse } from "next";

import serviceAccount from "../../src/firebase_private_key.json";
import googleCloudStorageAuth from "@/src/googleCloudStorageAuth";

type Data =
  | {
      url: string;
      accessToken: string;
    }
  | {
      error: string;
    };

export default async function createStorageToken(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (!(await checkAuth(req))) {
      res.status(403);
      res.json({
        error: "Permission denied",
      });
      res.end();
      return;
    }

    const storageToken = await googleCloudStorageAuth(
      getFirebasePrivateKey(),
      getFirebaseClientEmail()
    );

    const fileName = req.body.fileName;

    const url = `https://www.googleapis.com/upload/storage/v1/b/${getFirebaseProjectId()}.appspot.com/o?uploadType=media&name=${encodeURIComponent(
      fileName
    )}`;

    res.status(200);
    res.json({
      url,
      accessToken: storageToken.access_token,
    });
    res.end();
  } catch (err) {
    console.error("Google Cloud Storage auth error: ", err);

    res.status(400);
    res.json({
      error: "Failed to authenticate with Google Cloud Storage",
    });
    res.end();
  }
}

function getFirebasePrivateKey() {
  return serviceAccount.private_key;
}

function getFirebaseClientEmail() {
  return serviceAccount.client_email;
}

function getFirebaseProjectId() {
  return serviceAccount.project_id;
}

async function checkAuth(res: NextApiRequest): Promise<boolean> {
  // You should put your user authentication checks here
  return true;
}
