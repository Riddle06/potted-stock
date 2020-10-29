import * as firebaseAdmin from "firebase-admin";
import { idGenerator } from "camel-toolbox";
import { config } from "../configuration";
import * as path from "path";
import * as luxon from 'luxon';

firebaseAdmin.initializeApp(
    {
        credential: firebaseAdmin.credential.cert(config.firebaseKey),
        storageBucket: config.firebaseBucketName
    }
)

/**
 * 上傳圖片到 Firebase storage
 * @param destination 上傳路徑
 * @param filePath 圖片本機路徑
 */
export async function uploadToFirebaseStorage(destination: string, filePath: string): Promise<string> {
    const bucket = firebaseAdmin.storage().bucket();

    const extName = path.extname(filePath);

    if (extName.indexOf('png') === -1) {
        throw new Error('file type error');
    }

    return new Promise((resolve, reject) => {
        bucket.upload(filePath, {
            contentType: 'image/png',
            destination,
            public: true,
            metadata: {
                contentType: 'image/png',
                metadata: {
                    firebaseStorageDownloadTokens: idGenerator.generateV4UUID()
                }
            }

        }, async (err, file, apiResponse) => {

            if (err) { 
                reject(err)
                return;
            }

            const ret = await file.getSignedUrl({
                action: 'read',
                expires: luxon.DateTime.local().plus({ year: 1 }).toMillis(), 
            })

            resolve(ret[0]);
        })
    })

}

