import { config } from './configuration';
import express from "express";
import expressHandlebars from "express-handlebars"
import PageRouter from './page-routers';
import { setTasks } from './services/task.svc';

const app = express();

app.engine('handlebars', expressHandlebars({ defaultLayout: "" }));
app.set('view engine', 'handlebars');
app.use('/', PageRouter);
setTasks();
app.listen(config.appPort, () => {
    console.log(`server listen on ${config.appPort}`)

    console.log(`====== serverInfo`, {
        currentDate: new Date(),
        envConfig: process.env
    })
})

