import * as fs from "fs";
import * as util from "util";
import * as firebaseAdmin from "firebase-admin";
import * as path from "path";
import { idGenerator } from "camel-toolbox";

const json = fs.readFileSync(path.resolve(__dirname, '../../firebase-key.json'), { encoding: "utf-8" })
console.log(JSON.parse(json))

firebaseAdmin.initializeApp(
    {
        credential: firebaseAdmin.credential.cert(JSON.parse(json)),
        storageBucket: "rex-workspace-c5892.appspot.com"

    }
)



// const storage = new Storage({
//     projectId: 'rex-workspace-c5892',


// })
export async function uploadToFirebaseStorage(destination: string, filePath: string): Promise<string> {
    const bucket = firebaseAdmin.storage().bucket();

    await bucket.upload(filePath, {
        contentType: 'image/png',
        destination,
        public: true,
        metadata:{
            contentType: 'image/png',
            metadata: {
              firebaseStorageDownloadTokens: idGenerator.generateV4UUID()
            }
        }
        
    }, (err, file, apiResponse) => {

        console.log({ file })
    })


    return ""

    // const storage = firebase.storage();
    // console.log({
    //     app
    // })
    // const storage = app.storage()

    // const storageRef = storage.ref();

    // const mountainImageRef = storageRef.child(destination);

    // const buffer = await readFile(filePath)

    // const putResult = await mountainImageRef.put(buffer, {
    //     contentType: 'image/png'
    // });

    // const url = await putResult.ref.getDownloadURL()

    // console.log({ url })

    // return url;
}

