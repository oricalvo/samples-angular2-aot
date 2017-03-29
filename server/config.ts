import {readJSONFile} from "build-utils/fs";

export class EnvType {
    static DEV: string = "DEV";
    static PROD: string = "PROD";
}

export interface Config {
    version?: string,
    env: EnvType,
    basePath: string,
    httpPort?: number,
    httpsPort?: number,
}

const defaultConfig: Config = {
    env: EnvType.DEV,
    version: '1.0.0',
    basePath: "..",
    httpPort: 8080,
    httpsPort: undefined,
};

const config: Config = Object.assign({}, defaultConfig);

export function get() {
    return config;
}

export function set(c: Config) {
    for(let key in c) {
        config[key] = c[key];
    }
}

export async function loadFrom(configFilePath: string): Promise<Config> {
    const config = Object.assign({}, defaultConfig);

    const configFromFile = await readJSONFile(configFilePath);
    Object.assign(config, configFromFile);

    return config;
}

export function dump(config: Config) {
    console.log("Configuration");
    console.log("-------------");
    console.log("    env: " + config.env);
    console.log("    version: " + config.version);
    console.log("    httpPort: " + config.httpPort);
    console.log("    httpsPost: " + config.httpsPort);
}
