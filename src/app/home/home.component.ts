import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import {
    mnmHttpInterceptorRouterParams,
    ModalService,
    OauthService,
} from '../../../projects/mnm-webapp/src/public_api';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
})
export class HomeComponent {
    public data = -1;

    public constructor(
        public httpClient: HttpClient,
        public router: Router,
        public activatedRoute: ActivatedRoute
    ) {
        this.httpClient
            .get('https://google.com')
            .subscribe(() => console.log('loading done'));

        this.router.navigate([], {
            relativeTo: activatedRoute,
            queryParams: {
                hello: 'world',
            },
            queryParamsHandling: 'merge',
            state: {
                [mnmHttpInterceptorRouterParams.resumeRequests]: true,
            },
        });
    }
}
