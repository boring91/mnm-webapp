import { Component } from '@angular/core';
import {
    ModalService,

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
  standalone: true
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
