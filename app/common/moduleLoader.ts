import {Injectable, NgModuleFactory, SystemJsNgModuleLoader, Compiler} from "@angular/core";

@Injectable()
export class ModuleLoader extends SystemJsNgModuleLoader {
    constructor(private compiler: Compiler) {
        super(compiler);
    }

    load(path: string): Promise<NgModuleFactory<any>> {
        var offlineMode = this.compiler instanceof Compiler;
        if(!offlineMode) {
            return super.load(path);
        }

        let parts = path.split("#");
        let url = parts[0];
        let moduleName = parts[1];
        //return loadModule(moduleName);

        console.log("ModuleLoader.load: " + path);

        return new Promise((resolve, reject)=> {
            let parts = path.split("#");
            let url = parts[0];
            const ngModuleName = parts[1];

            if(offlineMode) {
                parts = url.split("/");
                if(parts[0]=="") {
                    parts.shift();
                }

                if (parts[0] == "app") {
                    parts.shift();
                }

                if(parts[parts.length-1]=="module") {
                    parts.pop();
                }

                url = parts.join(".") + ".bundle.js";
            }

            return SystemJS.import(url).then(m => {
                if(!globals.modules[ngModuleName]) {
                    throw new Error("Didn't find globals.modules[" + ngModuleName + "] pending promise");
                }

                globals.modules[ngModuleName].then(factory => {
                    resolve(factory);
                });
            });
        });
    }

    static notifyLoaded(moduleName: string, moduleFactory: any) {
        globals.modules[moduleName] = Promise.resolve(moduleFactory);
    }
}
