import * as express from "express";
import * as path from "path";
import * as exphbs from "express-handlebars";
import * as configurator from "./config";
import * as nopack from "nopack";
import "tslib";
import {Config} from "./config";
import {EnvType} from "./config";

let config: Config;

init().catch(err => {
    console.error(err);
});

async function init() {
    config = await loadConfig();

    const app = express();

    //
    //  View engine for handling handlebars (hbs) files
    //
    const viewEngine = createViewEngine(app);

    registerStatic(app);

    if(config.env == EnvType.DEV) {
        nopack.setup(app);
    }

    registerNotFoundForFileLikeUrls(app);
    registerIndexHtmlForAnyGETRequest(app);
    registerNotAllowed(app);

    app.listen(config.httpPort, function () {
        console.log(`Server is listening on ${config.httpPort}`);
    });

    if (config.httpsPort !== undefined) {
        app.listen(config.httpsPort, function () {
            console.log(`Server is listening on ${config.httpsPort}`);
        });
    }
}

function registerNotFoundForFileLikeUrls(app) {
    app.use(function (req, res, next) {
        if (req.url.indexOf(".") != -1) {
            res.status(404);
            res.end();
            return;
        }

        next();
    });
}

function registerIndexHtmlForAnyGETRequest(app) {
    app.get("*", function (req, res) {
        res.setHeader("Cache-Control", "public, max-age=900");

        const indexHtmlFilePath = path.join(config.basePath, "index.hbs");
        res.render(indexHtmlFilePath, {
            config: config,
            generatedAt: new Date(),
            isProduction: config.env == EnvType.PROD
        });
    });
}

function registerNotAllowed(app) {
    app.use(function (req, res) {
        res.status(405);
        res.end();
    });
}

function createViewEngine(app) {
    //
    //  We hold partials and views in the same directory
    //
    const partialsAndViewsPath = path.join(config.basePath, "views");

    //
    //  We start with empty helpers and later add additional (for example, the translate helper)
    //
    var hbs = exphbs.create({
        extname: ".hbs",
        helpers: {
            'json': function (context) {
                return JSON.stringify(context);
            }
        }
    });

    app.engine('hbs', hbs.engine);
    app.set('view engine', 'hbs');

    return hbs;
}

function registerStatic(app) {
    var staticEx = express.static(path.join(config.basePath, "."), {
        maxAge: 90000,
    });

    app.use('/', function (req, res, next) {
        console.log("STATIC: " + req.url);

        staticEx(req, res, next);
    });
}

async function loadConfig() {
    let config = await configurator.loadFrom(path.resolve(__dirname, "config.json"));

    if (!config.env && process.env.NODE_ENV) {
        config.env = process.env.NODE_ENV;
    }

    if(!path.isAbsolute(config.basePath)) {
        config.basePath = path.join(__dirname, config.basePath);
    }

    configurator.dump(config);

    return config;
}
