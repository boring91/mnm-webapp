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
    public constructor(private modalService: ModalService) {}

    public async show(): Promise<void> {
        await this.modalService.show(TestComponent);
    }
}

@Component({
    selector: 'app-test',
    template: `
        <button (click)="show()">Show modal</button>
        <button (click)="dismissAll()">Dismiss all</button>
    `,
})
class TestComponent {
    public constructor(private modalService: ModalService) {}

    public async show(): Promise<void> {
        await this.modalService.show(TestComponent);
    }

    public async dismissAll(): Promise<void> {
        await this.modalService.dismissAll();
    }
}
