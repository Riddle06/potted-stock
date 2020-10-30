import { config } from './configuration';
import express from "express";
import expressHandlebars from "express-handlebars"
import PageRouter from './page-routers';
import ApiRouter from "./api-routers";
import { setTasks } from './services/task.svc';
import * as path from "path";

const app = express();

// set static folder
app.use('/static', express.static(path.resolve(__dirname, '../generate-files')));

// set view
app.engine('handlebars', expressHandlebars({ defaultLayout: "" }));
app.set('view engine', 'handlebars');

// set page controller
app.use('/', PageRouter);

// set pai controller
app.use('/api', ApiRouter)

// set schedule tasks
setTasks();

app.listen(config.appPort, () => {
    console.log(`server listen on ${config.appPort}`)
    console.log(`====== serverInfo`, {
        currentDate: new Date(),
        envConfig: process.env
    })
})

process.on('unhandledRejection', console.dir);
