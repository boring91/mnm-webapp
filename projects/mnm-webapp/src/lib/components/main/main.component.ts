import { Component } from '@angular/core';
import { LoadingComponent } from '../loading/loading.component';
import { ModalContainerComponent } from '../../services/modal/components/modal-container/modal-container.component';

@Component({
    selector: 'mnm-main',
    template: `
        <mnm-loading></mnm-loading>
        <mnm-modal></mnm-modal>
    `,
    standalone: true,
    imports: [LoadingComponent, ModalContainerComponent]
})
export class MnmMainComponent {}
