import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MnmWebappModule } from 'projects/mnm-webapp/src/public_api';
import { AppService } from './app.service';
import { AppRoutingModule } from './app.routing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@NgModule({
    declarations: [],
    imports: [
        BrowserModule,
        MnmWebappModule.forRoot({
            oauthConfig: {
                claimsUrl: 'http://localhost:5004/claims',
                oauthUrl: 'http://localhost:5004',
            },
        }),
        AppRoutingModule,
    ],
    providers: [AppService, provideHttpClient(withInterceptorsFromDi())],
})
export class AppModule {}
