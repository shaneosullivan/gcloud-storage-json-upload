import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRef, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [tokenResult, setTokenResult] = useState("" as string);
  const [uploadStatus, setUploadStatus] = useState("" as string);
  const [mediaLink, setMediaLink] = useState("" as string);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  function generateToken() {
    setUploadStatus("");
    fetch("/api/createStorageToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: "test/myfile.txt",
      }),
    })
      .then((res) => res.text())
      .then((result) => {
        setTokenResult(result);
      });
  }

  function uploadFile() {
    const textAreaNode = textAreaRef.current;
    if (!textAreaNode) {
      return;
    }
    setUploadStatus("running");
    const textToUpload = textAreaNode.value;

    const { url, accessToken } = JSON.parse(tokenResult);

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        Authorization: `Bearer ${accessToken}`,
      },
      body: textToUpload,
    })
      .then((response) => response.json())
      .then((response) => {
        /*
        Example response
        {
          bucket: "kid-art.appspot.com",
          contentType: "image/gif",
          crc32c: "VP/tGw==",
          etag: "CPvk8unsuv8CEAE=",
          generation: "1686473891689083",
          id: "kid-art.appspot.com/gif/my_animation_1686473890587.gif/1686473891689083",
          kind: "storage#object",
          md5Hash: "opNEdHyZqAlnUdv7/FCz1w==",
          mediaLink:
            "https://www.googleapis.com/download/storage/v1/b/kid-art.appspot.com/o/gif%2Fmy_animation_1686473890587.gif?generation=1686473891689083&alt=media",
          metageneration: "1",
          name: "gif/my_animation_1686473890587.gif",
          selfLink:
            "https://www.googleapis.com/storage/v1/b/kid-art.appspot.com/o/gif%2Fmy_animation_1686473890587.gif",
          size: "66510",
          storageClass: "STANDARD",
          timeCreated: "2023-06-11T08:58:11.730Z",
          timeStorageClassUpdated: "2023-06-11T08:58:11.730Z",
          updated: "2023-06-11T08:58:11.730Z",
        };
        */

        console.log("Upload response", response);

        if (!response.error) {
          setUploadStatus("success");
          setMediaLink(response.mediaLink);
        } else {
          setUploadStatus("failed");
        }
      })
      .catch((err) => {
        console.error("Upload caused error", err);
        setUploadStatus("failed");
      });
  }

  return (
    <>
      <Head>
        <title>NEXTJS GCloud Auth Example</title>
        <meta
          name="description"
          content="An example of how to create a NextJS API that generates a Google Cloud Authentication token without installing the Google Cloud Admin SDK"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.description}>
          <div>
            {tokenResult ? (
              <div className={styles.box}>
                <pre className={styles.code}>
                  {JSON.stringify(JSON.parse(tokenResult), null, 2)}
                </pre>
                <div className={styles.uploadBox}>
                  <h3>Upload a text file to the url returned from the API</h3>
                  <textarea
                    className={styles.textarea}
                    cols={60}
                    ref={textAreaRef}
                  >
                    This is some sample text for the file to upload, edit it if
                    you like
                  </textarea>
                  <div className={styles.box}>
                    <button onClick={uploadFile}>Upload</button>
                  </div>
                  {uploadStatus ? (
                    <div className={styles.box}>Upload {uploadStatus}</div>
                  ) : null}
                  {mediaLink ? (
                    <div className={styles.box}>
                      Download the file from{" "}
                      <a href={mediaLink} target="_blank">
                        HERE
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className={styles.box}>
                No token generated yet, click the button
              </div>
            )}
          </div>
          <button onClick={generateToken} title="Click to generate a new token">
            Generate Token
          </button>
        </div>
      </main>
    </>
  );
}
