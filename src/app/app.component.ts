import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MnmMainComponent } from 'projects/mnm-webapp/src/lib/components/main/main.component';

@Component({
    selector: 'app-root',
    template: '<router-outlet></router-outlet><mnm-main></mnm-main>',
    standalone: true,
    imports: [RouterOutlet, MnmMainComponent]
})
export class AppComponent {}
