import * as dotenv from "dotenv";
dotenv.config();

export interface Configuration {
    appPort: number
}

export const config: Configuration = {
    appPort: getPort()
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