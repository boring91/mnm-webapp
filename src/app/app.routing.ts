import { Routes, RouterModule } from '@angular/router';
import { NotificationComponent } from './notification/notification.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'notification',
        component: NotificationComponent
    }
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {

}