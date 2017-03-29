import {Component, SystemJsNgModuleLoader, Compiler} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: "my-app",
  moduleId: module.id,
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  constructor(private router: Router) {
  }

  ngOnInit() {
    this.router.navigate(["home"]);
  }

  loadModule() {
    this.router.navigate(["/admin"]);
  }
}
