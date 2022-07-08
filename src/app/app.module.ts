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
                claimsUrl: 'http://localhost:5000/claims',
                oauthUrl: 'http://localhost:5000',
            },
            modal: {
                animations: {
                    dialogEnterAnimation: [
                        style({
                            transform: 'scale(70%, 70%)',
                            opacity: 0.5,
                        }),
                        animate(
                            // '500ms cubic-bezier(.19,1.33,.69,.97)',
                            '150ms cubic-bezier(.19,1.33,.46,.98)',
                            style({
                                transform: 'scale(100%, 100%)',
                                opacity: 1,
                            })
                        ),
                    ],

                    dialogLeaveAnimation: [
                        style({
                            transform: 'scale(100%, 100%)',
                            opacity: 1.0,
                        }),
                        animate(
                            // '500ms cubic-bezier(.19,1.33,.69,.97)',
                            '150ms cubic-bezier(.19,1.33,.46,.98)',
                            style({
                                transform: 'scale(98%, 98%)',
                                opacity: 0.5,
                            })
                        ),
                    ],
                },
            },
        }),
        AppRoutingModule,
        HttpClientModule,
    ],
    providers: [AppService],
    bootstrap: [AppComponent],
})
export class AppModule {}
