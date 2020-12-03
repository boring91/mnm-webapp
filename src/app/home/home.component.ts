import { Component, OnInit, ViewChild } from "@angular/core";
import {
  WizardComponent,
  LoadingService,
  NotificationService,
} from "../../../projects/mnm-webapp/src/public_api";
import { AppService } from "../app.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
})
export class HomeComponent implements OnInit {
  @ViewChild("wizard", { static: true }) wizard: WizardComponent;

  constructor(
    private appService: AppService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.loadingService.showLoading();

      setTimeout(() => {
        this.loadingService.hideLoading();
      }, 2000);
    }, 2000);
  }
  test(id: string) {
    alert(id);
  }
}
