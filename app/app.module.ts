import {
    NgModule, NgModuleFactoryLoader
}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent}  from './layout/app.component';
import {ClockComponent} from "./components/clock.component";
import {FormsModule} from "@angular/forms";
import { RouterModule, Routes } from '@angular/router';
import {ModuleLoader} from "./common/moduleLoader";
import {appRoutes} from "./routes";
import {MainComponent} from "./home/components/main.component";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(appRoutes)
    ],
    declarations: [
        AppComponent,
        ClockComponent,
        MainComponent
    ],
    bootstrap: [AppComponent],
    providers: [
        { provide: NgModuleFactoryLoader, useClass: ModuleLoader }
    ]
})
export class AppModule {
}
