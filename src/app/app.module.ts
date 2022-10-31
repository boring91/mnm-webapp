import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MnmWebappModule } from 'projects/mnm-webapp/src/public_api';
import { AppService } from './app.service';
import { NotificationComponent } from './notification/notification.component';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { animate, style } from '@angular/animations';

@NgModule({
    declarations: [AppComponent, NotificationComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MnmWebappModule.forRoot({
            oauthConfig: {
                claimsUrl: 'http://localhost:5004/claims',
                oauthUrl: 'http://localhost:5004',
            },
        }),
        AppRoutingModule,
        HttpClientModule,
    ],
    providers: [AppService],
    bootstrap: [AppComponent],
})
export class AppModule {}
