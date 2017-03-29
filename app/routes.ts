import {Routes} from "@angular/router";
import {MainComponent} from "./home/components/main.component";

const home = "home";

export const appRoutes: Routes = [
    {
        path: 'home',
        component: MainComponent
    },
    {
        path: 'admin',
        loadChildren: "/app/admin/module#AdminModule",
    },
    {
        path: 'about',
        loadChildren: "/app/about/module#AboutModule",
    },
    {
        path: 'products',
        loadChildren: "/app/products/module#ProductsModule",
    },
];

