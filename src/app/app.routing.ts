import { Routes, RouterModule } from '@angular/router';
import { NotificationComponent } from './notification/notification.component';
import { NgModule } from '@angular/core';
const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./home/home.module').then(m => m.HomeModule),
    },
    {
        path: 'notification',
        component: NotificationComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
