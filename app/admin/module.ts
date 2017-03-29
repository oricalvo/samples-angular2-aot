import {NgModule}      from '@angular/core';
import {AppComponent}  from './components/app.component';
import {Routes, RouterModule} from "@angular/router";

const routes: Routes = [
    { path: '',  component: AppComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    declarations: [
        AppComponent,
    ],
})
export class AdminModule {
}
