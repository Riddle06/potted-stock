import * as dotenv from "dotenv";
dotenv.config();

export interface Configuration {
    appPort: number
}

export const config: Configuration = {
    appPort: +process.env.APP_PORT || 8080
}

