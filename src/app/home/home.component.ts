import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { first } from 'rxjs/operators';
import {
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
        private modalService: ModalService,
        public oauthService: OauthService,
        public httpClient: HttpClient
    ) {
        oauthService.userInfo$.pipe(first()).subscribe(x => {
            if (!x.isLoggedIn) {
                return;
            }
            this.loadData();
            this.loadData();
            this.loadData();
            this.loadData();
        });
    }

    public login() {
        const username = 'm2008m1033m@gmail.com';
        const password = 'Onepiece12!';
        this.oauthService.login(username, password, true).subscribe(res => {
            console.log(res);
            this.loadData();
        });
    }

    public logout() {
        this.oauthService.logout();
        this.data = -1;
    }

    public loadData() {
        console.log('Loading data');
        this.httpClient
            .get('https://jsonplaceholder.typicode.com/todos/1')
            .subscribe(res => {
                console.log('data loaded');
                this.data = (res as any).title;
            });
    }

    public showModal(): void {
        this.modalService.show(HomeComponent);
    }
}
