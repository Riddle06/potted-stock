import { config } from './configuration';
import express from "express";
import expressHandlebars from "express-handlebars"
import PageRouter from './page-routers';

const app = express();

app.engine('handlebars', expressHandlebars({ defaultLayout: "" }));
app.set('view engine', 'handlebars');

app.use('/', PageRouter);

app.listen(config.appPort, () => {
    console.log(`server listen on ${config.appPort}`)
})