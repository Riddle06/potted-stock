import { typeChecker } from "camel-toolbox";
import * as dotenv from "dotenv";
import * as fs from "fs";
dotenv.config();

export interface Configuration {
    appPort: number
    firebaseKey: unknown,
    firebaseBucketName: string
}

export const config: Configuration = {
    appPort: getPort(),
    firebaseKey: getFirebaseKey(),
    firebaseBucketName: process.env.FIREBASE_STORAGE_BUCKET_NAME
}


function getPort(): number {

    if (process.env.PORT) {
        return +process.env.PORT
    }

    if (process.env.APP_PORT) {
        return +process.env.APP_PORT
    }

    return 8080;
}

function getFirebaseKey(): unknown {

    if (process.env.FIREBASE_KEY_PATH && !typeChecker.isNullOrUndefinedOrWhiteSpace(process.env.FIREBASE_KEY_PATH)) {
        const keyPath = process.env.FIREBASE_KEY_PATH;
        const jsonString = fs.readFileSync(keyPath, { encoding: "utf-8" });
        return JSON.parse(jsonString);
    }

    if (process.env.FIREBASE_KEY_JSON) {
        const jsonString = process.env.FIREBASE_KEY_JSON;
        return JSON.parse(jsonString);
    }

    throw new Error(`firebase key not found`)
}