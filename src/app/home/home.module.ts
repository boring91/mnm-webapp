import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeService } from './home.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [HomeComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomeComponent,
            },
        ]),
    ],
    providers: [HomeService],
})
export class HomeModule {}
