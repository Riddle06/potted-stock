import { config } from './configuration';
import express from "express";
import expressHandlebars from "express-handlebars"
import PageRouter from './page-routers';
import { uploadToFirebaseStorage } from './services/upload.svc';

const app = express();

app.engine('handlebars', expressHandlebars({ defaultLayout: "" }));
app.set('view engine', 'handlebars');

app.use('/', PageRouter);

app.listen(config.appPort, () => {
    console.log(`server listen on ${config.appPort}`)
})

import * as fs from "fs";
import * as path from "path";

async function testUpload() {
    const filePath = path.resolve(__dirname, '../generate-files/1603522160.414.png')
    await uploadToFirebaseStorage('16035221601.png', filePath)
}

testUpload()