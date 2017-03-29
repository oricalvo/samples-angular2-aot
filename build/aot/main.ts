import { platformBrowser } from '@angular/platform-browser';
import { AppModuleNgFactory } from './app.module.ngfactory';
import {enableProdMode} from "@angular/core";

if(globals.isProduction) {
    enableProdMode();
}

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
